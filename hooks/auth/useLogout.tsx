"use client"

import { useMutation } from '@tanstack/react-query';

export function useLogoutUser() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Logout failed');
      }

      return res;
    },
  });
}