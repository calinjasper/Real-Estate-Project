'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
