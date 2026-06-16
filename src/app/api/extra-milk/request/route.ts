import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { order_date, extra_litres } = await request.json();

    if (!order_date || extra_litres === undefined) {
      return NextResponse.json({ success: false, message: 'order_date and extra_litres are required' }, { status: 400 });
    }

    if (![0.5, 1.0, 1.5].includes(extra_litres)) {
      return NextResponse.json({ success: false, message: 'Invalid extra_litres amount' }, { status: 400 });
    }

    // DEADLINE CHECK
    const { data: isWithinDeadline } = await adminSupabase.rpc('is_within_skip_deadline', {
      p_skip_date: order_date
    });

    if (!isWithinDeadline) {
      return NextResponse.json({
        success: false,
        message: 'Deadline passed! Extra milk order not allowed after 9 PM.'
      }, { status: 400 });
    }

    // Get active subscription (admin bypasses RLS)
    const { data: subscription, error: subError } = await adminSupabase
      .from('subscriptions')
      .select('*')
      .eq('customer_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      return NextResponse.json({ success: false, message: 'Active subscription not found' }, { status: 400 });
    }

    // CAPACITY CHECK
    const { data: capacityCheck, error: capacityError } = await adminSupabase.rpc('check_capacity', {
      p_date: order_date,
      p_litres: extra_litres
    });

    if (capacityError) {
      return NextResponse.json({ success: false, message: 'Failed to check capacity' }, { status: 500 });
    }

    if (!capacityCheck.can_book) {
      return NextResponse.json({
        success: false,
        capacity_full: true,
        available_litres: capacityCheck.available,
        message: `Sorry! Only ${capacityCheck.available}L available. Cannot add ${extra_litres}L extra.`
      }, { status: 400 });
    }

    // Calculate
    const charge_amount = Math.round((subscription.daily_rate * (extra_litres / subscription.quantity_litres)) * 100) / 100;

    const chargeDateObj = new Date(order_date);
    chargeDateObj.setMonth(chargeDateObj.getMonth() + 1);
    chargeDateObj.setDate(1);
    const charge_month = chargeDateObj.toISOString().split('T')[0];

    const deadlineObj = new Date(order_date);
    deadlineObj.setDate(deadlineObj.getDate() - 1);
    deadlineObj.setUTCHours(15, 30, 0, 0); // 9 PM IST

    // INSERT extra_milk_order
    const { data: extraOrder, error: insertError } = await adminSupabase
      .from('extra_milk_orders')
      .insert({
        subscription_id: subscription.id,
        customer_id: user.id,
        order_date,
        extra_litres,
        total_litres_that_day: subscription.quantity_litres + extra_litres,
        charge_amount,
        charge_month,
        deadline: deadlineObj.toISOString(),
        status: 'confirmed'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Extra milk request error:', insertError.message);
      return NextResponse.json({ success: false, message: 'Failed to request extra milk' }, { status: 500 });
    }

    // UPDATE daily_capacity
    const { data: capacity } = await adminSupabase
      .from('daily_capacity')
      .select('*')
      .eq('date', order_date)
      .maybeSingle();

    if (capacity) {
      const newBooked = Number(capacity.booked_litres) + Number(extra_litres);
      await adminSupabase
        .from('daily_capacity')
        .update({ booked_litres: newBooked, is_full: newBooked >= Number(capacity.total_litres) })
        .eq('id', capacity.id);
    }

    // UPDATE billing_months
    const chargeMonthDate = new Date(charge_month);
    const daysInMonth = new Date(chargeMonthDate.getFullYear(), chargeMonthDate.getMonth() + 1, 0).getDate();

    const { data: bMonth } = await adminSupabase
      .from('billing_months')
      .select('*')
      .eq('subscription_id', subscription.id)
      .eq('billing_month', charge_month)
      .maybeSingle();

    if (bMonth) {
      await adminSupabase
        .from('billing_months')
        .update({
          extra_charges: Number(bMonth.extra_charges) + Number(charge_amount),
          extra_litres_ordered: Number(bMonth.extra_litres_ordered) + Number(extra_litres),
          net_due: Number(bMonth.net_due) + Number(charge_amount)
        })
        .eq('id', bMonth.id);
    } else {
      await adminSupabase
        .from('billing_months')
        .insert({
          subscription_id: subscription.id,
          customer_id: user.id,
          billing_month: charge_month,
          quantity_litres: subscription.quantity_litres,
          monthly_amount: subscription.monthly_amount,
          daily_rate: subscription.daily_rate,
          days_in_month: daysInMonth,
          extra_charges: charge_amount,
          extra_litres_ordered: extra_litres,
          net_due: Number(subscription.monthly_amount) + Number(charge_amount)
        });
    }

    // UPDATE daily_delivery_sheet if exists
    const { data: deliverySheet } = await adminSupabase
      .from('daily_delivery_sheet')
      .select('id')
      .eq('subscription_id', subscription.id)
      .eq('delivery_date', order_date)
      .maybeSingle();

    if (deliverySheet) {
      await adminSupabase
        .from('daily_delivery_sheet')
        .update({
          extra_litres,
          is_extra: true,
          extra_order_id: extraOrder.id,
          total_litres: subscription.quantity_litres + extra_litres
        })
        .eq('id', deliverySheet.id);
    }

    return NextResponse.json({
      success: true,
      order_date,
      extra_litres,
      total_tomorrow: subscription.quantity_litres + extra_litres,
      charge_amount,
      charged_in: new Date(charge_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      message: `Extra ${extra_litres}L confirmed! Tomorrow you get ${subscription.quantity_litres + extra_litres}L total. ₹${charge_amount} added to next bill.`
    });

  } catch (err: any) {
    console.error('Extra milk request exception:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
