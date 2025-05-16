'use client';

import { useMutation } from '@tanstack/react-query';

type SignUpInput = {
    email: string;
    password: string;
    nick?: string;
    firstName?: string;
    lastName?: string;
    avatarURL?: string;
};

export function useSignUpUser() {
    return useMutation({
        mutationFn: async (data: SignUpInput) => {
            const formData = new FormData();
            formData.append('email', data.email);
            formData.append('password', data.password);
            if (data.nick) formData.append('nick', data.nick);
            if (data.firstName) formData.append('firstName', data.firstName);
            if (data.lastName) formData.append('lastName', data.lastName);
            if (data.avatarURL) formData.append('avatarURL', data.avatarURL);

            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json().catch(() => null);
                throw new Error(error?.error || 'Sign up failed');
            }

            return res;
        },
    });
}
