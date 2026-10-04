'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md py-3'
          : 'bg-white border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                Estate<span className="text-blue-600">Hub</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Luxury Homes
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname === '/'
                  ? 'text-blue-600 bg-blue-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Explore Properties
            </Link>
            {mounted && isAuthenticated && (
              <Link
                href="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === '/dashboard'
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                My Dashboard
              </Link>
            )}
          </nav>

          {/* Action Buttons & Auth */}
          <div className="flex items-center space-x-3">
            {mounted && (
              isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/properties/create"
                    className="hidden sm:inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Post Property</span>
                  </Link>

                  <div className="flex items-center space-x-2 bg-slate-100/80 p-1.5 pl-3 rounded-full border border-slate-200/60">
                    <span className="text-xs font-bold text-slate-700 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      title="Logout"
                      className="p-1.5 bg-white text-slate-500 hover:text-rose-600 rounded-full shadow-sm hover:shadow transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth/login"
                    className="text-slate-700 hover:text-blue-600 text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all duration-200 active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
