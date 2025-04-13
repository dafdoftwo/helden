"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/components/I18nProvider';

const UserMenu = () => {
  const { user, signOut, loading } = useAuth();
  const { t, language } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
      router.push(`/${language}`);
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-2">
        <div className="animate-pulse h-8 w-8 rounded-full bg-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center text-gray-600 hover:text-black focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={user ? t('auth.userMenu') : t('auth.accountMenu')}
      >
        {user ? (
          <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center overflow-hidden">
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.email || 'User avatar'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                <div className="font-medium truncate">{user.email}</div>
              </div>
              <Link
                href={`/${language}/account`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {t('auth.myAccount')}
              </Link>
              <Link
                href={`/${language}/account/orders`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {t('auth.myOrders')}
              </Link>
              <Link
                href={`/${language}/wishlist`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {t('auth.wishlist')}
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                {t('auth.signOut')}
              </button>
            </>
          ) : (
            <>
              <Link
                href={`/${language}/auth/login`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {t('auth.signIn')}
              </Link>
              <Link
                href={`/${language}/auth/register`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {t('auth.signUp')}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu; 