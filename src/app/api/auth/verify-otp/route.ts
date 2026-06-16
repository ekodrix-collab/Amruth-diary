import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const adminClient = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { phone, token } = await request.json();

    if (!phone || !token) {
      return NextResponse.json({ success: false, message: 'Phone and token are required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    let finalPhone = cleanPhone;
    if (cleanPhone.length === 10) {
      finalPhone = '+91' + cleanPhone;
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      finalPhone = '+' + cleanPhone;
    }

    // ─── DEV MODE BYPASS ─────────────────────────────────────────────
    // In development, accept code 123456 and sign in via admin client
    if (process.env.NODE_ENV === 'development' && token === '123456') {
      console.log(`[DEV] Bypass OTP for ${finalPhone}`);

      // Look up or create user in auth.users
      const { data: listData } = await adminClient.auth.admin.listUsers();
      let devUser = listData?.users?.find(
        (u) => u.phone === finalPhone || u.phone === cleanPhone
      );

      if (!devUser) {
        // Create user for this phone
        const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
          phone: finalPhone,
          phone_confirm: true,
        });
        if (createErr || !created.user) {
          console.error('[DEV] Failed to create user:', createErr?.message);
          return NextResponse.json({ success: false, message: 'Dev user creation failed' }, { status: 500 });
        }
        devUser = created.user;
      }

      // Ensure profile exists
      const { data: existingProfile } = await adminClient
        .from('profiles')
        .select('id, role')
        .eq('id', devUser.id)
        .maybeSingle();

      if (!existingProfile) {
        await adminClient.from('profiles').insert({
          id: devUser.id,
          phone: finalPhone,
          full_name: 'Dev User',
          role: 'customer',
        });
      }

      const role = existingProfile?.role || 'customer';
      return NextResponse.json({ success: true, role, profile: existingProfile });
    }
    // ─────────────────────────────────────────────────────────────────

    const supabase = await createClient();

    // Verify real OTP
    const { data: authData, error: authError } = await supabase.auth.verifyOtp({
      phone: finalPhone,
      token,
      type: 'sms'
    });

    if (authError || !authData.user) {
      console.error('Verify OTP Error:', authError?.message);
      return NextResponse.json({ success: false, message: authError?.message || 'Verification failed' }, { status: 400 });
    }

    const userId = authData.user.id;

    // Create profile if new user
    let { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: insertError } = await adminClient
        .from('profiles')
        .insert({
          id: userId,
          phone: finalPhone,
          full_name: 'New Customer',
          role: 'customer'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Profile creation error:', insertError.message);
        return NextResponse.json({ success: false, message: 'Failed to create user profile' }, { status: 500 });
      }
      profile = newProfile;
    }

    return NextResponse.json({
      success: true,
      session: authData.session,
      profile,
      role: profile?.role || 'customer'
    });

  } catch (err: any) {
    console.error('Verify OTP exception:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

