'use client';

import { useMutation } from '@tanstack/react-query';

interface LoginPayload {
    email: string;
    password: string;
}

export function useLoginUser() {
    return useMutation({
        mutationFn: async ({ email, password }: LoginPayload) => {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Login failed');
            }

            return res;
        },
    });
}
