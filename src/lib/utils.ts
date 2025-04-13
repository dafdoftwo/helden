import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Formats an order ID to be more user-friendly
 * Takes the first 8 characters of a UUID or returns the full ID if shorter
 */
export function formatOrderId(orderId: string): string {
  if (!orderId) return '';
  return orderId.length > 8 ? orderId.substring(0, 8) : orderId;
}

/**
 * Formats a price with the appropriate currency
 */
export function formatPrice(price: number, locale: string = 'en'): string {
  if (isNaN(price)) return '';
  
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(price);
}

/**
 * تنسيق التاريخ بالتنسيق المناسب للغة
 */
export function formatDate(date: string | Date, locale: string = 'en'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * اختصار النص الطويل وإضافة علامات الحذف
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generates classes conditionally using a map of class names to boolean values
 * Inspired by the classnames library
 */
export function classNames(...classes: (string | Record<string, boolean> | null | undefined)[]): string {
  const result: string[] = [];

  classes.forEach(item => {
    if (!item) return;
    
    if (typeof item === 'string') {
      result.push(item);
    } else {
      Object.entries(item).forEach(([className, condition]) => {
        if (condition) {
          result.push(className);
        }
      });
    }
  });

  return result.join(' ');
}

/**
 * Creates a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/&/g, '-and-')   // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

/**
 * Checks if an object is empty
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * Delays execution for a specified number of milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * ميزج فئات CSS باستخدام clsx و tailwind-merge
 * يستخدم لدمج الفئات بشكل ديناميكي وتجنب تعارضات Tailwind
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * تنسيق المبلغ المالي بتنسيق العملة المناسب
 */
export function formatCurrency(amount: number, currency: string = 'SAR', locale: string = 'ar-SA'): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount);
}

/**
 * توليد معرف فريد للطلب
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
} 