import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerCheckoutSession } from '@/lib/stripe';

// Initialize Stripe with proper error handling
let stripe: Stripe | undefined;
try {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.warn('Stripe secret key is not set in environment variables');
  } else {
    stripe = new Stripe(stripeKey);
  }
} catch (error) {
  console.error('Failed to initialize Stripe:', error);
}

export async function POST(request: NextRequest) {
  // Ensure Stripe is initialized
  if (!stripe) {
    console.error('Stripe is not properly initialized');
    return NextResponse.json(
      { error: 'Stripe configuration is missing' },
      { status: 500 }
    );
  }

  try {
    const { items, paymentMethod } = await request.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Items array is required' },
        { status: 400 }
      );
    }
    
    // Create checkout session using the helper from lib/stripe
    const session = await createServerCheckoutSession(stripe, items);
    
    return NextResponse.json({
      id: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 