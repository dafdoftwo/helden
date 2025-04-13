"use client";

import { supabase } from '@/lib/supabase';

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  provider: string;
  estimatedDays: string;
  trackingUrl?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
}

// Available shipping methods
export const SHIPPING_PROVIDERS = {
  ARAMEX: 'aramex',
  SMSA: 'smsa',
  DHL: 'dhl',
};

/**
 * Get available shipping options based on the delivery address
 * 
 * @param address The shipping address details
 * @returns List of available shipping options
 */
export const getShippingOptions = async (address: ShippingAddress): Promise<ShippingOption[]> => {
  try {
    // In a real implementation, this would call the actual shipping providers' APIs
    // For this prototype, we'll return mock data based on the city
    
    // Get list of shipping options from database
    const { data, error } = await supabase
      .from('shipping_options')
      .select('*')
      .eq('active', true);
    
    if (error) {
      console.error('Error fetching shipping options:', error);
      return getDefaultShippingOptions(address.city);
    }
    
    return data.map(option => ({
      id: option.id,
      name: option.name,
      price: option.price,
      provider: option.provider,
      estimatedDays: option.estimated_days,
      trackingUrl: option.tracking_url_template,
    }));
  } catch (error) {
    console.error('Error in getShippingOptions:', error);
    return getDefaultShippingOptions(address.city);
  }
};

/**
 * Calculate shipping cost for a specific order
 * 
 * @param address Shipping address
 * @param weight Total weight of the order in kg
 * @param provider Shipping provider code
 * @returns Calculated shipping cost
 */
export const calculateShippingCost = async (
  address: ShippingAddress,
  weight: number,
  provider: string
): Promise<number> => {
  // In a real implementation, this would call the shipping provider's API
  // For now, we'll return a fixed cost based on the provider and city
  
  const options = await getShippingOptions(address);
  const selectedOption = options.find(option => option.provider === provider);
  
  if (selectedOption) {
    // Apply weight-based pricing
    let cost = selectedOption.price;
    
    if (weight > 5) {
      // Add extra fee for heavy packages
      cost += (weight - 5) * 10; // 10 SAR per kg above 5kg
    }
    
    return cost;
  }
  
  // Default pricing
  switch (provider) {
    case SHIPPING_PROVIDERS.ARAMEX:
      return 30;
    case SHIPPING_PROVIDERS.SMSA:
      return 35;
    case SHIPPING_PROVIDERS.DHL:
      return 50;
    default:
      return 30;
  }
};

/**
 * Create a shipping label with the provider
 * 
 * @param orderId Order ID
 * @param address Shipping address
 * @param provider Shipping provider code
 * @returns Tracking number and label URL
 */
export const createShippingLabel = async (
  orderId: string,
  address: ShippingAddress,
  provider: string
): Promise<{ trackingNumber: string; labelUrl: string }> => {
  try {
    // In a real implementation, this would call the shipping provider's API
    // For now, we'll return a mock tracking number
    
    // Generate a mock tracking number
    const trackingNumber = `${provider.toUpperCase()}-${Date.now()}-${orderId.substring(0, 6)}`;
    
    // Save the tracking number to the database
    await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        shipping_provider: provider,
        shipping_status: 'processing',
      })
      .eq('id', orderId);
    
    return {
      trackingNumber,
      labelUrl: `/api/shipping/labels/${trackingNumber}`,
    };
  } catch (error) {
    console.error('Error in createShippingLabel:', error);
    throw new Error('Failed to create shipping label');
  }
};

/**
 * Track a shipment status
 * 
 * @param trackingNumber The tracking number
 * @param provider Shipping provider code
 * @returns Current shipment status
 */
export const trackShipment = async (
  trackingNumber: string,
  provider: string
): Promise<{
  status: string;
  location: string;
  estimatedDelivery: string;
  events: Array<{ date: string; status: string; location: string }>;
}> => {
  try {
    // In a real implementation, this would call the shipping provider's API
    // For now, we'll return mock data
    
    // Mock shipment statuses
    const statuses = [
      'processing',
      'label_created',
      'in_transit',
      'out_for_delivery',
      'delivered',
    ];
    
    // Use the first 4 characters of the tracking number to determine the status
    // This is just for demo purposes, to have some variation in statuses
    const hash = trackingNumber.substring(0, 4).charCodeAt(0) % 5;
    const status = statuses[hash];
    
    const today = new Date();
    const events = [
      {
        date: new Date(today.setDate(today.getDate() - 3)).toISOString(),
        status: 'label_created',
        location: 'Riyadh, SA',
      },
    ];
    
    if (hash >= 1) {
      events.push({
        date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
        status: 'in_transit',
        location: 'Jeddah, SA',
      });
    }
    
    if (hash >= 3) {
      events.push({
        date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
        status: 'out_for_delivery',
        location: 'Final Destination, SA',
      });
    }
    
    if (hash === 4) {
      events.push({
        date: new Date(today.setDate(today.getDate() + 1)).toISOString(),
        status: 'delivered',
        location: 'Final Destination, SA',
      });
    }
    
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5 - hash);
    
    return {
      status,
      location: events[events.length - 1].location,
      estimatedDelivery: estimatedDelivery.toISOString(),
      events,
    };
  } catch (error) {
    console.error('Error in trackShipment:', error);
    throw new Error('Failed to track shipment');
  }
};

// Helper function to get default shipping options
const getDefaultShippingOptions = (city: string): ShippingOption[] => {
  // Special pricing for major cities
  const isMajorCity = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'].includes(city);
  
  return [
    {
      id: 'standard',
      name: 'Standard Shipping (3-7 days)',
      price: isMajorCity ? 30 : 40,
      provider: SHIPPING_PROVIDERS.ARAMEX,
      estimatedDays: '3-7',
    },
    {
      id: 'express',
      name: 'Express Shipping (1-3 days)',
      price: isMajorCity ? 60 : 80,
      provider: SHIPPING_PROVIDERS.SMSA,
      estimatedDays: '1-3',
    },
    {
      id: 'premium',
      name: 'Premium Shipping (Next day)',
      price: isMajorCity ? 100 : 120,
      provider: SHIPPING_PROVIDERS.DHL,
      estimatedDays: '1',
    },
  ];
}; 