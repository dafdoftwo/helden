"use client";

import { redirect } from 'next/navigation';

export default function ArabicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  redirect('/ar');
  return null;
} 