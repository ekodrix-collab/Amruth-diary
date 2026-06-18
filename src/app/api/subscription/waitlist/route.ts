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

    const { quantity_litres, requested_start_date } = await request.json();

    if (!quantity_litres || !requested_start_date) {
      return NextResponse.json({
        success: false,
        message: 'quantity_litres and requested_start_date are required'
      }, { status: 400 });
    }

    if (![0.5, 1.0, 1.5, 2.0].includes(quantity_litres)) {
      return NextResponse.json({ success: false, message: 'Invalid quantity' }, { status: 400 });
    }

    // Check if already on waitlist
    const { data: existing } = await adminSupabase
      .from('waitlist')
      .select('id, position, status')
      .eq('customer_id', user.id)
      .in('status', ['waiting', 'notified'])
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: false,
        message: `You are already on the waitlist at position #${existing.position}.`,
        position: existing.position,
        status: existing.status
      }, { status: 400 });
    }

    // Check if already has active subscription
    const { data: existingSub } = await adminSupabase
      .from('subscriptions')
      .select('id')
      .eq('customer_id', user.id)
      .in('status', ['active', 'pending_payment'])
      .maybeSingle();

    if (existingSub) {
      return NextResponse.json({
        success: false,
        message: 'You already have an active subscription.'
      }, { status: 400 });
    }

    // Insert into waitlist (trigger auto-assigns position)
    const { data: entry, error: insertError } = await adminSupabase
      .from('waitlist')
      .insert({
        customer_id: user.id,
        quantity_litres,
        requested_start_date,
        status: 'waiting'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Waitlist insert error:', insertError.message);
      return NextResponse.json({ success: false, message: 'Failed to join waitlist' }, { status: 500 });
    }

    // Get customer profile for notification
    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('phone, full_name')
      .eq('id', user.id)
      .single();

    // Queue notification
    if (profile) {
      await adminSupabase.from('notifications_log').insert({
        recipient_id: user.id,
        recipient_phone: profile.phone,
        recipient_name: profile.full_name,
        recipient_type: 'customer',
        notification_type: 'waitlist_joined',
        message_body: `You're #${entry.position} on the Amruth Milk waitlist! ` +
          `We'll notify you as soon as a ${quantity_litres}L/day slot opens. ` +
          `Thanks for your patience! 🥛`
      });
    }

    return NextResponse.json({
      success: true,
      position: entry.position,
      quantity_litres: entry.quantity_litres,
      requested_start_date: entry.requested_start_date,
      message: `You have been added to the waitlist at position #${entry.position}!`
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Waitlist request exception:', message);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
