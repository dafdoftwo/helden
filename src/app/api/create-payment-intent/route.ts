import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Prevent this route from being statically generated for export
export const dynamic = "error";

export async function POST(req: Request) {
  try {
    const { amount, currency = 'sar' } = await req.json();
    
    // Initialize Stripe with proper error handling
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'Stripe API key is not configured' },
        { status: 500 }
      );
    }
    
    const stripe = new Stripe(stripeKey);
    
    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents/smallest currency unit
      currency,
      payment_method_types: ['card'],
      metadata: {
        order_id: Date.now().toString(), // Replace with actual order ID in production
      },
    });
    
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    }, { status: 200 });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 