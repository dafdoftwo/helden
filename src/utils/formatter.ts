/**
 * Format a number as a price with currency symbol
 * @param price - The price to format
 * @param currency - The currency code (default: SAR)
 * @returns Formatted price string
 */
export function formatPrice(price: number, currency: string = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Format a date as a localized string
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: ar-SA)
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: string = 'ar-SA'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

/**
 * Format a number with the specified number of decimal places
 * @param value - The number to format
 * @param decimals - The number of decimal places
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Format a phone number for Saudi Arabia
 * @param phone - The phone number to format
 * @returns Formatted phone number
 */
export function formatPhone(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a Saudi number
  if (cleaned.startsWith('966')) {
    // Format: +966 5X XXX XXXX
    return `+${cleaned.substring(0, 3)} ${cleaned.substring(3, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  } else if (cleaned.startsWith('05')) {
    // Format: 05X XXX XXXX
    return `${cleaned.substring(0, 2)}${cleaned.substring(2, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  // Return as is if it doesn't match expected formats
  return phone;
} 