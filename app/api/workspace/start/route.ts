import { z } from 'zod';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const createWorkspaceSchema = z.object({
    name: z.string().min(1, 'Názov je povinný'),
    description: z.string().min(1, 'Popis je povinný'),
    emojiLogo: z.string().emoji('Musí byť emoji'),
    banner: z.string(),
});

export async function POST(req: Request) {
    const supabase = createRouteHandlerClient({ cookies });
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = createWorkspaceSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            { error: result.error.flatten() },
            { status: 400 },
        );
    }

    const { name, description, emojiLogo, banner } = result.data;

    try {
        const dbUser = await db.user.findUnique({
            where: { email: user.email! },
        });

        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found in DB' },
                { status: 404 },
            );
        }

        const newWorkspace = await db.workspace.create({
            data: {
                name,
                description,
                emojiLogo,
                userId: dbUser.id,
                banner,
            },
        });

        return NextResponse.json({ workspace: newWorkspace }, { status: 201 });
    } catch (error) {
        console.error('Error creating workspace:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
