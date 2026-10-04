'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  useEffect(() => {
    // Check if user is logged in on app start (runs in background, doesn't block UI)
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Always render children — auth check happens in background
  return <>{children}</>;
}
