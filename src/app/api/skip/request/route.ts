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

    const { skip_date } = await request.json();

    if (!skip_date) {
      return NextResponse.json({ success: false, message: 'skip_date is required' }, { status: 400 });
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

    // DEADLINE CHECK
    const { data: isWithinDeadline } = await adminSupabase.rpc('is_within_skip_deadline', {
      p_skip_date: skip_date
    });

    if (!isWithinDeadline) {
      return NextResponse.json({
        success: false,
        message: 'Deadline passed! Skip not allowed after 9 PM. You can skip from day after tomorrow.'
      }, { status: 400 });
    }

    // DUPLICATE CHECK
    const { data: existingSkip } = await adminSupabase
      .from('skip_requests')
      .select('id')
      .eq('subscription_id', subscription.id)
      .eq('skip_date', skip_date)
      .maybeSingle();

    if (existingSkip) {
      return NextResponse.json({ success: false, message: `You already skipped ${skip_date}.` }, { status: 400 });
    }

    // VACATION CHECK
    const { data: vacation } = await adminSupabase
      .from('vacation_pauses')
      .select('id')
      .eq('subscription_id', subscription.id)
      .lte('pause_start', skip_date)
      .gte('pause_end', skip_date)
      .in('status', ['confirmed', 'active'])
      .maybeSingle();

    if (vacation) {
      return NextResponse.json({ success: false, message: `You already have a vacation pause on ${skip_date}.` }, { status: 400 });
    }

    // Calculate credits
    const credit_amount = subscription.daily_rate;
    const skipDateObj = new Date(skip_date);
    skipDateObj.setMonth(skipDateObj.getMonth() + 1);
    skipDateObj.setDate(1);
    const credit_month = skipDateObj.toISOString().split('T')[0];

    const deadlineObj = new Date(skip_date);
    deadlineObj.setDate(deadlineObj.getDate() - 1);
    deadlineObj.setUTCHours(15, 30, 0, 0); // 9 PM IST = 15:30 UTC

    // INSERT skip_request
    const { data: skipRequest, error: insertError } = await adminSupabase
      .from('skip_requests')
      .insert({
        subscription_id: subscription.id,
        customer_id: user.id,
        skip_date,
        deadline: deadlineObj.toISOString(),
        status: 'confirmed',
        credit_amount,
        credit_month
      })
      .select()
      .single();

    if (insertError) {
      console.error('Skip request error:', insertError.message);
      return NextResponse.json({ success: false, message: 'Failed to request skip' }, { status: 500 });
    }

    // UPDATE daily_delivery_sheet
    await adminSupabase
      .from('daily_delivery_sheet')
      .update({ is_skip: true, delivery_status: 'skipped', total_litres: 0, skip_id: skipRequest.id })
      .eq('subscription_id', subscription.id)
      .eq('delivery_date', skip_date);

    // UPDATE billing_months
    const creditMonthDate = new Date(credit_month);
    const daysInMonth = new Date(creditMonthDate.getFullYear(), creditMonthDate.getMonth() + 1, 0).getDate();

    const { data: bMonth } = await adminSupabase
      .from('billing_months')
      .select('*')
      .eq('subscription_id', subscription.id)
      .eq('billing_month', credit_month)
      .maybeSingle();

    if (bMonth) {
      await adminSupabase
        .from('billing_months')
        .update({
          skip_credit: Number(bMonth.skip_credit) + Number(credit_amount),
          days_skipped: (bMonth.days_skipped || 0) + 1,
          net_due: Math.max(0, Number(bMonth.net_due) - Number(credit_amount))
        })
        .eq('id', bMonth.id);
    } else {
      await adminSupabase
        .from('billing_months')
        .insert({
          subscription_id: subscription.id,
          customer_id: user.id,
          billing_month: credit_month,
          quantity_litres: subscription.quantity_litres,
          monthly_amount: subscription.monthly_amount,
          daily_rate: subscription.daily_rate,
          days_in_month: daysInMonth,
          skip_credit: credit_amount,
          days_skipped: 1,
          net_due: Math.max(0, Number(subscription.monthly_amount) - Number(credit_amount))
        });
    }

    // UPDATE daily_capacity
    const { data: capacity } = await adminSupabase
      .from('daily_capacity')
      .select('*')
      .eq('date', skip_date)
      .maybeSingle();

    if (capacity) {
      const newBooked = Math.max(0, Number(capacity.booked_litres) - Number(subscription.quantity_litres));
      await adminSupabase
        .from('daily_capacity')
        .update({ booked_litres: newBooked, is_full: newBooked >= Number(capacity.total_litres) })
        .eq('id', capacity.id);
    }

    return NextResponse.json({
      success: true,
      skip_date,
      credit_amount,
      applied_to: new Date(credit_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      message: `Skip confirmed! ₹${Number(credit_amount).toFixed(2)} credit added to next bill`
    });

  } catch (err: any) {
    console.error('Skip request exception:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
