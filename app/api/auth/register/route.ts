import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const nick = String(formData.get('nick') || ''); // optional
  const firstName = String(formData.get('firstName') || '');
  const lastName = String(formData.get('lastName') || '');
  const avatarURL = String(formData.get('avatarURL') || '');

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/api/auth/callback`,
    },
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message || 'Sign up failed' }, { status: 400 });
  }

  try {
    await db.user.create({
      data: {
        email,
        password, // Ideally this should be hashed or omitted if not needed (Supabase handles auth)
        nick,
        firstName,
        lastName,
        avatarURL,
      },
    });
  } catch (dbError) {
    console.error('DB error:', dbError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.redirect(requestUrl.origin, { status: 301 });
}