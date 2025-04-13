"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Package2Icon } from 'lucide-react';
import ShippingTracker from '@/components/ShippingTracker';

export default function TrackingPage() {
  const t = useTranslations('Shipping');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [submittedTracking, setSubmittedTracking] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setSubmittedTracking(trackingNumber.trim());
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Package2Icon className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold">{t('track_your_order')}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('enter_tracking_number')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tracking-number" className="block text-sm font-medium text-gray-700 mb-1">
              {t('tracking_number')}
            </label>
            <input
              type="text"
              id="tracking-number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder={t('tracking_number_placeholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('track_package')}
          </button>
        </form>
      </div>
      
      {submittedTracking && (
        <ShippingTracker trackingNumber={submittedTracking} />
      )}
      
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-lg text-blue-800 mb-2">{t('tracking_tips_title')}</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-700">
          <li>{t('tracking_tip_1')}</li>
          <li>{t('tracking_tip_2')}</li>
          <li>{t('tracking_tip_3')}</li>
          <li>{t('tracking_tip_4')}</li>
        </ul>
      </div>
    </div>
  );
} 