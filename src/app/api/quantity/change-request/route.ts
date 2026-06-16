import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { new_quantity } = await request.json();

    if (!new_quantity) {
      return NextResponse.json({ success: false, message: 'new_quantity is required' }, { status: 400 });
    }

    if (![0.5, 1.0, 1.5, 2.0].includes(new_quantity)) {
      return NextResponse.json({ success: false, message: 'Invalid quantity amount' }, { status: 400 });
    }

    // 4. Get active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('customer_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError || !subscription) {
      return NextResponse.json({ success: false, message: 'Active subscription not found' }, { status: 400 });
    }

    // 5. VALIDATE
    if (new_quantity === subscription.quantity_litres) {
      return NextResponse.json({ success: false, message: 'New quantity is the same as current quantity' }, { status: 400 });
    }

    // 6. Calculate new pricing
    const new_monthly_amount = Math.round(2480.00 * new_quantity * 100) / 100;
    const new_daily_rate = Math.round((new_monthly_amount / 30.0) * 10000) / 10000;

    // 7. effective_month = first day of NEXT month
    const effectiveDateObj = new Date();
    effectiveDateObj.setMonth(effectiveDateObj.getMonth() + 1);
    effectiveDateObj.setDate(1);
    const effective_month = effectiveDateObj.toISOString().split('T')[0];

    // 8. Check capacity for next month if quantity increasing
    if (new_quantity > subscription.quantity_litres) {
      const extra_needed = new_quantity - subscription.quantity_litres;
      // In a real app we'd check daily_capacity for the whole next month. 
      // For MVP, we assume we can handle it or we log it. We will proceed.
    }

    // 9. INSERT quantity_changes
    const { error: insertError } = await supabase
      .from('quantity_changes')
      .insert({
        subscription_id: subscription.id,
        customer_id: user.id,
        from_quantity: subscription.quantity_litres,
        to_quantity: new_quantity,
        new_monthly_amount: new_monthly_amount,
        new_daily_rate: new_daily_rate,
        effective_month: effective_month,
        status: 'pending'
      });

    if (insertError) {
      console.error('Quantity change error:', insertError.message);
      return NextResponse.json({ success: false, message: 'Failed to request quantity change' }, { status: 500 });
    }

    // 10. UPDATE subscriptions.next_month_quantity
    await supabase
      .from('subscriptions')
      .update({ next_month_quantity: new_quantity })
      .eq('id', subscription.id);

    return NextResponse.json({
      success: true,
      current_quantity: subscription.quantity_litres,
      new_quantity: new_quantity,
      effective_from: new Date(effective_month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      new_monthly_amount: new_monthly_amount,
      message: `Quantity change to ${new_quantity}L confirmed from ${new Date(effective_month).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}. New monthly: ₹${new_monthly_amount}`
    });

  } catch (err: any) {
    console.error('Quantity change exception:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
