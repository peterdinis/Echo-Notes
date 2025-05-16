import { useQuery } from '@tanstack/react-query';

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await fetch('/api/auth/profile');

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || 'Failed to fetch user');
      }

      const { user } = await res.json();
      return user;
    },
  });
}