"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';
import { FiPackage, FiTruck, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { mockShippingProviders } from '@/lib/mock-data';

interface ShippingProvider {
  id: string | number;
  name: string;
  description?: string;
  logo?: string;
  delivery_days?: number;
  deliveryTime?: string;
  base_cost?: number;
  price?: number;
  priority?: number;
  currency?: string;
  isPopular?: boolean;
}

interface ShippingProviderSelectorProps {
  selectedProvider: number | string | null;
  onSelect: (providerId: number | string) => void;
  setShippingCost: (cost: number) => void;
  address: {
    city: string;
    [key: string]: any;
  };
  items: any[];
}

const ShippingProviderSelector: React.FC<ShippingProviderSelectorProps> = ({
  selectedProvider,
  onSelect,
  setShippingCost,
  address,
  items
}) => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<ShippingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch shipping providers
  useEffect(() => {
    const fetchShippingProviders = async () => {
      try {
        // For static export, use mock data instead of API call
        setTimeout(() => {
          const mapProviders = mockShippingProviders.map(provider => ({
            id: provider.id,
            name: provider.name,
            description: `${provider.deliveryTime} delivery`,
            logo: provider.logo,
            delivery_days: parseInt(provider.deliveryTime.split('-')[1]) || 3,
            base_cost: provider.price,
            priority: provider.isPopular ? 1 : 0
          }));

          setProviders(mapProviders);
          
          // Auto-select the first provider if none is selected
          if (mapProviders.length > 0 && !selectedProvider) {
            onSelect(mapProviders[0].id);
            setShippingCost(mapProviders[0].base_cost || 0);
          }
          
          setLoading(false);
        }, 800); // Simulate network delay
      } catch (err) {
        console.error('Error fetching shipping providers:', err);
        setError('Unable to load shipping options');
        setLoading(false);
      }
    };
    
    fetchShippingProviders();
  }, [selectedProvider, onSelect, setShippingCost]);
  
  // Calculate shipping cost when provider or address changes
  const calculateShippingCost = (provider: ShippingProvider) => {
    // For static export, use provider's base cost plus a small city-based modifier
    const baseCost = provider.base_cost || 0;
    let cityModifier = 0;
    
    if (address.city) {
      const cityLower = address.city.toLowerCase();
      if (cityLower === 'riyadh') {
        cityModifier = 0;
      } else if (cityLower === 'jeddah' || cityLower === 'dammam') {
        cityModifier = 5;
      } else {
        cityModifier = 10;
      }
    }
    
    const totalCost = baseCost + cityModifier;
    setShippingCost(totalCost);
  };
  
  // Handle provider selection
  const handleProviderSelect = (provider: ShippingProvider) => {
    onSelect(provider.id);
    calculateShippingCost(provider);
  };
  
  if (loading) {
    return (
      <div className="mt-4 animate-pulse">
        <h3 className="text-lg font-medium mb-3">{t('checkout.shipping_method')}</h3>
        <div className="bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-3">{t('checkout.shipping_method')}</h3>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}. {t('common.please_try_again')}
        </div>
      </div>
    );
  }
  
  if (!providers.length) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-3">{t('checkout.shipping_method')}</h3>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg">
          {t('checkout.no_shipping_options')}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">{t('checkout.shipping_method')}</h3>
      <div className="space-y-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            onClick={() => handleProviderSelect(provider)}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedProvider === provider.id
                ? 'border-helden-purple bg-purple-50 shadow-sm'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {provider.logo ? (
                  <div className="w-12 h-12 relative flex-shrink-0">
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiTruck className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{provider.name}</h4>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1 text-gray-600">
                  <FiCalendar className="w-4 h-4" />
                  <span>{provider.delivery_days} {t('common.days')}</span>
                </div>
                <div className="flex items-center space-x-1 font-medium">
                  <FiDollarSign className="w-4 h-4" />
                  <span>{provider.base_cost} {t('common.sar')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingProviderSelector; 