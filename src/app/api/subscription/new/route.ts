import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';

// Admin client bypasses RLS for all DB writes
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

    const body = await request.json();
    const { quantity = 1.0, start_date } = body;

    if (!start_date) {
      return NextResponse.json({ success: false, message: 'start_date is required' }, { status: 400 });
    }

    // 2. Check customer has no existing active subscription (use admin to bypass RLS)
    const { data: existingSub } = await adminSupabase
      .from('subscriptions')
      .select('id, status')
      .eq('customer_id', user.id)
      .in('status', ['active', 'pending_payment'])
      .maybeSingle();

    if (existingSub) {
      return NextResponse.json({ 
        success: false, 
        message: 'You already have an active or pending subscription.' 
      }, { status: 400 });
    }

    // 4. CHECK CAPACITY: Call RPC check_capacity
    const { data: capacityCheck, error: capacityError } = await adminSupabase.rpc('check_capacity', {
      p_date: start_date,
      p_litres: quantity
    });

    if (capacityError) {
      console.error('Capacity check error:', capacityError.message);
      return NextResponse.json({ success: false, message: 'Failed to check capacity' }, { status: 500 });
    }

    const { can_book, is_full } = capacityCheck;

    if (!can_book || is_full) {
      // INSERT into waitlist
      const { data: waitlistEntry, error: waitlistError } = await adminSupabase
        .from('waitlist')
        .insert({
          customer_id: user.id,
          quantity_litres: quantity,
          requested_start_date: start_date,
          status: 'waiting'
        })
        .select()
        .single();

      if (waitlistError) {
        return NextResponse.json({ success: false, message: 'Failed to join waitlist' }, { status: 500 });
      }

      return NextResponse.json({ 
        success: false, 
        waitlisted: true, 
        position: waitlistEntry.position,
        message: `Capacity is full. You have been added to the waitlist at position #${waitlistEntry.position}.`
      }, { status: 200 }); // Status 200 because it's a valid business flow
    }

    // 5. Calculate amounts
    const monthly_amount = Math.round(2480.00 * quantity * 100) / 100; // e.g. 2480.00
    
    // 6. Create Razorpay order
    let razorpay_order_id = null;
    
    // Only try to create Razorpay order if keys are present (prevents crash in local dev without keys)
    if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const orderOptions = {
        amount: Math.round(monthly_amount * 100), // amount in paise
        currency: "INR",
        receipt: `rcpt_sub_${user.id.slice(0, 8)}_${Date.now()}`
      };

      const order = await razorpay.orders.create(orderOptions);
      razorpay_order_id = order.id;
    }

    // 7. INSERT subscription with status='pending_payment' (or 'active' in dev mode)
    const initialStatus = razorpay_order_id ? 'pending_payment' : 'active';
    const { data: subscription, error: subError } = await adminSupabase
      .from('subscriptions')
      .insert({
        customer_id: user.id,
        quantity_litres: quantity,
        monthly_amount: monthly_amount,
        start_date: start_date,
        status: initialStatus,
        razorpay_subscription_id: razorpay_order_id // We use this field to store the initial order ID for simplicity before webhook
      })
      .select()
      .single();

    if (subError) {
      console.error('Subscription insert error:', subError.message);
      return NextResponse.json({ success: false, message: 'Failed to create subscription' }, { status: 500 });
    }

    // 8. INSERT billing_months for current month
    const billingMonthDate = new Date(start_date);
    billingMonthDate.setDate(1); // Set to 1st of the month
    const formattedBillingMonth = billingMonthDate.toISOString().split('T')[0];

    // Calculate days in month
    const nextMonth = new Date(billingMonthDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(0);
    const daysInMonth = nextMonth.getDate();

    const { error: billingError } = await adminSupabase
      .from('billing_months')
      .insert({
        subscription_id: subscription.id,
        customer_id: user.id,
        billing_month: formattedBillingMonth,
        quantity_litres: quantity,
        monthly_amount: subscription.monthly_amount,
        daily_rate: subscription.daily_rate,
        days_in_month: daysInMonth
      });

    if (billingError) {
      console.error('Billing month insert error:', billingError.message);
      // We don't fail the whole request here, but log it
    }

    // 9. Return Razorpay order details for payment modal
    return NextResponse.json({
      success: true,
      subscription_id: subscription.id,
      monthly_amount: monthly_amount,
      razorpay_order_id: razorpay_order_id,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });

  } catch (err: any) {
    console.error('Create subscription exception:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
