import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session?.user) {
    return NextResponse.json({ error: error?.message || 'Login failed' }, { status: 401 });
  }

  // Získať používateľa z Prisma DB podľa e-mailu
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found in local database' }, { status: 404 });
  }

  // ⬅️ Ak chceš, môžeš tu nastaviť cookie alebo token (napr. JWT) alebo presmerovať
  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  });
}