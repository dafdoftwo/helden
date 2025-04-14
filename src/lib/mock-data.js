/**
 * Mock data for static export
 * This file provides static data that replaces API calls during static export
 */

// Shipping providers mock data
export const mockShippingProviders = [
  {
    id: 'aramex',
    name: 'Aramex',
    logo: '/images/shipping/aramex.png',
    price: 25,
    currency: 'SAR',
    deliveryTime: '2-3 days',
    isPopular: true
  },
  {
    id: 'dhl',
    name: 'DHL Express',
    logo: '/images/shipping/dhl.png',
    price: 35,
    currency: 'SAR',
    deliveryTime: '1-2 days',
    isPopular: false
  },
  {
    id: 'fedex',
    name: 'FedEx',
    logo: '/images/shipping/fedex.png',
    price: 30,
    currency: 'SAR',
    deliveryTime: '2-3 days',
    isPopular: false
  },
  {
    id: 'saudipost',
    name: 'Saudi Post',
    logo: '/images/shipping/saudipost.png',
    price: 15,
    currency: 'SAR',
    deliveryTime: '3-5 days',
    isPopular: false
  }
];

// Tracking information mock data
export const mockTrackingInfo = {
  trackingNumber: '12345678',
  status: 'In Transit',
  estimatedDelivery: '2025-04-15',
  origin: 'Riyadh',
  destination: 'Jeddah',
  history: [
    {
      status: 'Order Placed',
      location: 'Online',
      timestamp: '2025-04-10T10:30:00Z'
    },
    {
      status: 'Preparing for Shipment',
      location: 'Riyadh Warehouse',
      timestamp: '2025-04-11T14:22:00Z'
    },
    {
      status: 'Picked Up',
      location: 'Riyadh Distribution Center',
      timestamp: '2025-04-12T09:15:00Z'
    },
    {
      status: 'In Transit',
      location: 'En Route to Jeddah',
      timestamp: '2025-04-13T11:05:00Z'
    }
  ]
};

// Payment methods mock data
export const mockPaymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: 'credit-card',
    isDefault: true
  },
  {
    id: 'cod',
    name: 'Cash on Delivery',
    icon: 'banknote',
    isDefault: false
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    icon: 'apple',
    isDefault: false
  }
];

// Mock order success data
export const mockOrderSuccess = {
  orderId: 'ORD1234567',
  status: 'confirmed',
  items: [
    {
      id: 'prod-123',
      name: 'Elegant Abaya',
      price: 350,
      quantity: 1,
      image: '/images/products/abaya1.jpg'
    },
    {
      id: 'prod-456',
      name: 'Casual Dress',
      price: 280,
      quantity: 2,
      image: '/images/products/dress1.jpg'
    }
  ],
  shippingAddress: {
    name: 'Sarah Ahmed',
    street: '123 King Fahd Road',
    city: 'Riyadh',
    state: 'Riyadh Province',
    postalCode: '12345',
    country: 'Saudi Arabia'
  },
  shippingMethod: {
    provider: 'Aramex',
    cost: 25,
    estimatedDelivery: '2-3 days'
  },
  subtotal: 910,
  shipping: 25,
  tax: 45.5,
  total: 980.5,
  paymentMethod: 'Credit Card'
}; 