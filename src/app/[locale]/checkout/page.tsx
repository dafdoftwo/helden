"use client";

import React, { useState } from 'react';
import { useTranslation } from '@/i18n/client';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { createCheckoutSession } from '@/lib/stripe';
import { useRouter } from 'next/navigation';
import { FiChevronRight, FiCreditCard, FiSmartphone, FiTruck, FiShield, FiCheck } from 'react-icons/fi';
import { StripeProduct } from '@/models/product';

// Component to display payment method options
interface PaymentMethodProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
  paymentMethods: {
    [key: string]: {
      type: string;
      icon: string;
    };
  } | null;
}

const PaymentMethodSelector = ({ selectedMethod, onSelect, paymentMethods }: PaymentMethodProps) => {
  if (!paymentMethods) return null;
  
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-3">Payment Method</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(paymentMethods).map(([key, method]) => (
          <div 
            key={key}
            onClick={() => onSelect(key)}
            className={`border rounded-lg p-3 flex items-center justify-center cursor-pointer transition-all ${
              selectedMethod === key 
                ? 'border-helden-purple bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {method.icon ? (
              <div className="h-10 w-auto relative flex items-center justify-center">
                <Image 
                  src={method.icon} 
                  alt={method.type} 
                  width={80} 
                  height={40} 
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-sm font-medium">{method.type}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CheckoutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
  });
  const [paymentMethods, setPaymentMethods] = useState<any>(null);

  // Step 1: Shipping Information
  const handleShippingInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStep(2);
  };

  // Step 2: Payment Method Selection
  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method);
  };

  // Step 3: Handle Checkout with selected payment method
  const handleCheckout = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      switch (paymentMethod) {
        case 'stripe':
        case 'card':
          handleStripeCheckout();
          break;
        case 'mada':
          handleMadaCheckout();
          break;
        case 'apple_pay':
          handleApplePayCheckout();
          break;
        case 'tabby':
          handleTabbyCheckout();
          break;
        case 'tamara':
          handleTamaraCheckout();
          break;
        case 'cod':
          handleCashOnDeliveryCheckout();
          break;
        default:
          handleStripeCheckout();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('An error occurred during checkout. Please try again.');
      setIsLoading(false);
    }
  };

  // Fetch payment methods from the API
  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/checkout/payment-methods');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.payment_methods);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };
  
  // Handle Stripe checkout
  const handleStripeCheckout = async () => {
    try {
      // Convert cart items to StripeProduct format
      const items = cart.items.map(item => ({
        id: item.product.id.toString(), // Convert to string
        name: t(item.product.name),
        price: item.product.price,
        quantity: item.quantity,
        images: [item.product.image],
        description: `${item.size ? t('product.size') + ': ' + item.size : ''} ${item.color ? t('product.color') + ': ' + item.color : ''}`.trim(),
      } as StripeProduct));
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cartItems: items,
          shippingAddress: shippingInfo,
          paymentMethod: 'card'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Set available payment methods if returned from the API
      if (data.payment_methods) {
        setPaymentMethods(data.payment_methods);
      }
      
      // Clear the cart after successful checkout (for when user returns from Stripe)
      clearCart();
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
      setIsLoading(false);
    }
  };

  // Handle Mada checkout
  const handleMadaCheckout = async () => {
    try {
      // Convert cart items to StripeProduct format
      const items = cart.items.map(item => ({
        id: item.product.id.toString(), // Convert to string
        name: t(item.product.name),
        price: item.product.price,
        quantity: item.quantity,
        images: [item.product.image],
        description: `${item.size ? t('product.size') + ': ' + item.size : ''} ${item.color ? t('product.color') + ': ' + item.color : ''}`.trim(),
      } as StripeProduct));
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cartItems: items,
          shippingAddress: shippingInfo,
          paymentMethod: 'mada'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Clear the cart after successful checkout (for when user returns from Mada)
      clearCart();
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
      setIsLoading(false);
    }
  };

  // Handle Apple Pay checkout
  const handleApplePayCheckout = async () => {
    try {
      // Convert cart items to StripeProduct format
      const items = cart.items.map(item => ({
        id: item.product.id.toString(), // Convert to string
        name: t(item.product.name),
        price: item.product.price,
        quantity: item.quantity,
        images: [item.product.image],
        description: `${item.size ? t('product.size') + ': ' + item.size : ''} ${item.color ? t('product.color') + ': ' + item.color : ''}`.trim(),
      } as StripeProduct));
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cartItems: items,
          shippingAddress: shippingInfo,
          paymentMethod: 'apple_pay'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Clear the cart after successful checkout (for when user returns from Apple Pay)
      clearCart();
      
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
      setIsLoading(false);
    }
  };

  // Handle Tabby checkout (Buy Now, Pay Later - 4 installments)
  const handleTabbyCheckout = async () => {
    try {
      // Convert cart items to StripeProduct format for the API
      const items = cart.items.map(item => ({
        id: item.product.id.toString(),
        name: t(item.product.name),
        price: item.product.price,
        quantity: item.quantity,
        images: [item.product.image],
        description: `${item.size ? t('product.size') + ': ' + item.size : ''} ${item.color ? t('product.color') + ': ' + item.color : ''}`.trim(),
      } as StripeProduct));
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cartItems: items,
          shippingAddress: shippingInfo,
          paymentMethod: 'tabby'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Clear the cart after successful checkout (for when user returns from Tabby)
      clearCart();
      
      // Redirect to Tabby Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
      setIsLoading(false);
    }
  };

  // Handle Tamara checkout (Buy Now, Pay Later)
  const handleTamaraCheckout = async () => {
    try {
      // Convert cart items to StripeProduct format for the API
      const items = cart.items.map(item => ({
        id: item.product.id.toString(),
        name: t(item.product.name),
        price: item.product.price,
        quantity: item.quantity,
        images: [item.product.image],
        description: `${item.size ? t('product.size') + ': ' + item.size : ''} ${item.color ? t('product.color') + ': ' + item.color : ''}`.trim(),
      } as StripeProduct));
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cartItems: items,
          shippingAddress: shippingInfo,
          paymentMethod: 'tamara'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Clear the cart after successful checkout (for when user returns from Tamara)
      clearCart();
      
      // Redirect to Tamara Checkout
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
      setIsLoading(false);
    }
  };

  // Handle Cash on Delivery checkout
  const handleCashOnDeliveryCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Convert cart items to StripeProduct format for the API
      const items = cart.items.map(item => ({
        id: item.product.id.toString(),
        name: t(item.product.name),
        price: item.product.price,
        quantity: item.quantity,
        images: [item.product.image],
        description: `${item.size ? t('product.size') + ': ' + item.size : ''} ${item.color ? t('product.color') + ': ' + item.color : ''}`.trim(),
      } as StripeProduct));
      
      // Create order directly in database
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          cartItems: items,
          shippingAddress: shippingInfo,
          paymentMethod: 'cod'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }
      
      // Clear the cart using the context method
      clearCart();
      
      // Redirect to success page
      router.push(`/${locale}/checkout/success?order_id=${data.orderId}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
      setIsLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">{t('checkout.title')}</h1>
        <p className="mb-8">{t('checkout.empty')}</p>
        <Link 
          href={`/${locale}/products`}
          className="inline-block px-6 py-3 bg-helden-purple text-white font-medium rounded-md hover:bg-helden-purple-dark transition-colors"
        >
          {t('checkout.startShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('checkout.title')}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-helden-purple' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-helden-purple text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="text-sm mt-2">{t('checkout.shippingInfo')}</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-helden-purple' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-helden-purple' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-helden-purple text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="text-sm mt-2">{t('checkout.payment')}</span>
          </div>
          <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-helden-purple' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-helden-purple' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-helden-purple text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="text-sm mt-2">{t('checkout.confirmation')}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {/* Step 1: Shipping Information */}
          {activeStep === 1 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('checkout.shippingInfo')}</h2>
              <form onSubmit={handleShippingInfoSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('checkout.fullName')}
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md focus:ring-helden-purple focus:border-helden-purple"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('checkout.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md focus:ring-helden-purple focus:border-helden-purple"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.address')}
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:ring-helden-purple focus:border-helden-purple"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('checkout.city')}
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md focus:ring-helden-purple focus:border-helden-purple"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('checkout.postalCode')}
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                      className="w-full px-4 py-2 border rounded-md focus:ring-helden-purple focus:border-helden-purple"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('checkout.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full px-4 py-2 border rounded-md focus:ring-helden-purple focus:border-helden-purple"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-helden-purple text-white font-medium rounded-md hover:bg-helden-purple-dark transition-colors"
                  >
                    {t('checkout.continue')}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Step 2: Payment Method */}
          {activeStep === 2 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('checkout.paymentMethod')}</h2>
              
              <PaymentMethodSelector 
                selectedMethod={paymentMethod || ''}
                onSelect={handlePaymentMethodSelect}
                paymentMethods={paymentMethods}
              />

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-6 py-2 border border-helden-purple text-helden-purple rounded-md hover:bg-purple-50 transition-colors"
                >
                  {t('checkout.back')}
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  disabled={!paymentMethod}
                  className="px-6 py-2 bg-helden-purple text-white font-medium rounded-md hover:bg-helden-purple-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {t('checkout.continue')}
                </button>
              </div>
              
              <div className="mt-6 text-sm text-gray-500">
                <p className="flex items-center mb-2">
                  <FiShield className="h-4 w-4 mr-2 text-green-500" />
                  {t('checkout.paymentSecure')}
                </p>
                <p className="flex items-center">
                  <FiCheck className="h-4 w-4 mr-2 text-green-500" />
                  {t('checkout.returnPolicy')}
                </p>
              </div>
            </div>
          )}
          
          {/* Step 3: Review & Place Order */}
          {activeStep === 3 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{t('checkout.reviewOrder')}</h2>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">{t('checkout.shippingInfo')}</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>{shippingInfo.fullName}</p>
                  <p>{shippingInfo.address}</p>
                  <p>{shippingInfo.city}, {shippingInfo.postalCode}</p>
                  <p>{shippingInfo.phone}</p>
                  <p>{shippingInfo.email}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">{t('checkout.paymentMethod')}</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {paymentMethod === 'stripe' && (
                    <div className="flex items-center">
                      <FiCreditCard className="mr-2" />
                      <span>{t('checkout.creditCard')}</span>
                    </div>
                  )}
                  {paymentMethod === 'mada' && (
                    <div className="flex items-center">
                      <Image src="/images/payment/mada.png" alt="Mada" width={20} height={20} className="mr-2" />
                      <span>{t('checkout.mada')}</span>
                    </div>
                  )}
                  {paymentMethod === 'apple_pay' && (
                    <div className="flex items-center">
                      <Image src="/images/payment/apple-pay.png" alt="Apple Pay" width={20} height={20} className="mr-2" />
                      <span>{t('checkout.applePay')}</span>
                    </div>
                  )}
                  {paymentMethod === 'tabby' && (
                    <div className="flex items-center">
                      <Image src="/images/payment/tabby.png" alt="Tabby" width={20} height={20} className="mr-2" />
                      <span>{t('checkout.tabby')}</span>
                    </div>
                  )}
                  {paymentMethod === 'tamara' && (
                    <div className="flex items-center">
                      <Image src="/images/payment/tamara.png" alt="Tamara" width={20} height={20} className="mr-2" />
                      <span>{t('checkout.tamara')}</span>
                    </div>
                  )}
                  {paymentMethod === 'cod' && (
                    <div className="flex items-center">
                      <FiTruck className="mr-2" />
                      <span>{t('checkout.cashOnDelivery')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">{t('checkout.items')}</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {cart.items.map((item, index) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex items-center py-2 border-b last:border-0">
                      <div className="w-12 h-12 relative flex-shrink-0">
                        <Image 
                          src={item.product.image}
                          alt={t(item.product.name)}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded-md"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <p className="font-medium">{t(item.product.name)}</p>
                        <p className="text-sm text-gray-600">
                          {item.size && `${item.size}`}
                          {item.size && item.color && ' / '}
                          {item.color && `${item.color}`}
                          {' • '}
                          {item.quantity} × {item.product.price.toFixed(2)} {t('common.price')}
                        </p>
                      </div>
                      <div className="font-medium">
                        {(item.quantity * item.product.price).toFixed(2)} {t('common.price')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-6 py-2 border border-helden-purple text-helden-purple rounded-md hover:bg-purple-50 transition-colors"
                >
                  {t('checkout.back')}
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="px-6 py-2 bg-helden-purple text-white font-medium rounded-md hover:bg-helden-purple-dark transition-colors flex items-center"
                >
                  {isLoading ? (
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2" />
                  ) : null}
                  {t('checkout.placeOrder')}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">{t('checkout.orderSummary')}</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {cart.items.map((item, index) => (
                <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="flex py-4 border-b">
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image 
                      src={item.product.image}
                      alt={t(item.product.name)}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-md"
                    />
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">{t(item.product.name)}</h3>
                    <p className="text-sm text-gray-600">
                      {item.size && `${item.size}`}
                      {item.size && item.color && ' | '}
                      {item.color && `${t('product.color')}: ${item.color}`}
                    </p>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm">{item.product.price.toFixed(2)} {t('common.price')} × {item.quantity}</span>
                      <span className="font-medium">{(item.product.price * item.quantity).toFixed(2)} {t('common.price')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span>{cart.subtotal.toFixed(2)} {t('common.price')}</span>
              </div>
              
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span>{cart.shipping.toFixed(2)} {t('common.price')}</span>
              </div>
              
              <div className="flex justify-between">
                <span>{t('cart.tax')}</span>
                <span>{cart.tax.toFixed(2)} {t('common.price')}</span>
              </div>
              
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>{t('cart.total')}</span>
                <span className="text-helden-purple-dark">{cart.total.toFixed(2)} {t('common.price')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 