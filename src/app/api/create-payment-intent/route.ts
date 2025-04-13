import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { amount, currency = 'sar' } = await req.json();
    
    // Initialize Stripe with the secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    
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