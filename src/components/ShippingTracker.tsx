"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TruckIcon, MapPinIcon, PackageIcon, CheckCircleIcon } from 'lucide-react';

interface ShippingEvent {
  date: string;
  status: string;
  location: string;
  description: string;
}

interface TrackingInfo {
  trackingNumber: string;
  provider: string;
  status: string;
  estimatedDelivery: string;
  events: ShippingEvent[];
  trackingUrl?: string;
}

export default function ShippingTracker({ trackingNumber }: { trackingNumber: string }) {
  const t = useTranslations('Shipping');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/shipping/track?tracking_number=${trackingNumber}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch tracking information');
        }
        
        const data = await response.json();
        setTrackingInfo(data);
      } catch (err) {
        console.error('Error fetching tracking info:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (trackingNumber) {
      fetchTrackingInfo();
    }
  }, [trackingNumber]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return <PackageIcon className="w-6 h-6 text-amber-500" />;
      case 'in_transit':
        return <TruckIcon className="w-6 h-6 text-blue-500" />;
      case 'out_for_delivery':
        return <MapPinIcon className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      default:
        return <PackageIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 border border-red-200">
        <h3 className="text-lg font-semibold text-red-700">{t('tracking_error')}</h3>
        <p className="mt-2 text-red-600">{error}</p>
      </div>
    );
  }

  if (!trackingInfo) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">{t('tracking_title')}</h2>
          <p className="text-gray-600">
            {t('tracking_number')}: <span className="font-medium">{trackingInfo.trackingNumber}</span>
          </p>
        </div>
        {trackingInfo.trackingUrl && (
          <a 
            href={trackingInfo.trackingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {t('track_on_carrier')}
          </a>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{t('status')}</h3>
          <p className="text-sm text-gray-600">
            {t('estimated_delivery')}: {formatDate(trackingInfo.estimatedDelivery)}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-3">
          {getStatusIcon(trackingInfo.status)}
          <div>
            <p className="font-medium">{t(`status_${trackingInfo.status.toLowerCase()}`)}</p>
            <p className="text-sm text-gray-600">{t('shipped_via')} {trackingInfo.provider}</p>
          </div>
        </div>
      </div>

      <h3 className="font-semibold mb-4">{t('tracking_history')}</h3>
      <ol className="relative border-l border-gray-200 ml-3">
        {trackingInfo.events.map((event, index) => (
          <li key={index} className="mb-6 ml-6">
            <span className="absolute flex items-center justify-center w-6 h-6 bg-white rounded-full -left-3 ring-8 ring-white">
              {getStatusIcon(event.status)}
            </span>
            <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-base">{t(`status_${event.status.toLowerCase()}`)}</h4>
                <time className="text-xs text-gray-500">{formatDate(event.date)}</time>
              </div>
              <p className="text-gray-600 text-sm mb-1">{event.location}</p>
              <p className="text-gray-500 text-sm">{event.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
} 