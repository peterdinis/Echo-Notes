import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = cookies();

    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json(
            { error: error?.message || 'Not authenticated' },
            { status: 401 },
        );
    }

    return NextResponse.json({ user });
}
