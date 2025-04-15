"use client";

import { loadStripe, Stripe } from '@stripe/stripe-js';
import { StripeProduct, StripeSession } from '@/models/product';

// Initialize Stripe with the publishable key
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    // Process env variables in Next.js client components must be prefixed with NEXT_PUBLIC_
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn('Stripe publishable key is not set in environment variables');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export const createPaymentIntent = async (amount: number, currency: string = 'sar') => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, currency }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const handlePayment = async (paymentMethodId: string, amount: number) => {
  try {
    // Create a payment intent
    const { clientSecret } = await createPaymentIntent(amount);
    
    // Get Stripe instance
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }
    
    // Confirm the payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    });
    
    if (result.error) {
      throw result.error;
    }
    
    return result.paymentIntent;
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
};

/**
 * Creates a checkout session with Stripe
 * 
 * @param items List of products to checkout
 * @param paymentMethod Optional specific payment method to use
 * @returns The created session with ID and URL
 */
export const createCheckoutSession = async (
  items: StripeProduct[], 
  paymentMethod?: string
): Promise<StripeSession> => {
  try {
    const response = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        items,
        paymentMethod 
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// This function would be used on the server side to create a Stripe checkout session
export const createServerCheckoutSession = async (
  stripe: any,
  items: any[],
  customerId?: string
) => {
  try {
    // Calculate the total amount
    const amount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Format the line items for Stripe
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'sar',
        product_data: {
          name: item.name,
          images: item.images ? [item.images[0]] : [],
        },
        unit_amount: item.price * 100, // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Create the checkout session
    const sessionParams: any = {
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      metadata: {
        orderId: Date.now().toString(), // This would be replaced with a real order ID
      },
    };

    // Add customer ID if available
    if (customerId) {
      sessionParams.customer = customerId;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return session;
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw error;
  }
}; 