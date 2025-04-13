import React from 'react';
import Link from 'next/link';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useTranslation } from '@/i18n';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  const { language } = useTranslation();
  const isRTL = language === 'ar';
  const ChevronIcon = isRTL ? FiChevronLeft : FiChevronRight;

  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-2 rtl:space-x-reverse">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronIcon className="mx-2 h-4 w-4 text-gray-400" />}
            {index === items.length - 1 ? (
              <span className="text-sm font-medium text-gray-500" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="text-sm font-medium text-helden-purple-light hover:text-helden-purple-DEFAULT">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}; 