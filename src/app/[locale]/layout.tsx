import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import '../globals.css';
import '@/lib/supabase'; // Import Supabase to initialize it

export const metadata: Metadata = {
  title: 'HELDEN Online Store',
  description: 'Shop the latest women\'s fashion with HELDEN - Saudi Arabia\'s premier fashion destination',
};

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ar' }
  ];
}

export const dynamic = 'force-dynamic';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale || 'en';

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
}