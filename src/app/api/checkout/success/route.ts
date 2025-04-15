export const dynamic = "error";
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Add proper error handling for Stripe initialization
let stripe: Stripe | undefined;
let endpointSecret: string | undefined;

try {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!stripeKey) {
    console.warn('Stripe secret key is not set in environment variables');
  } else {
    stripe = new Stripe(stripeKey);
  }
  
  if (!webhookSecret) {
    console.warn('Stripe webhook secret is not set in environment variables');
  } else {
    endpointSecret = webhookSecret;
  }
} catch (error) {
  console.error('Failed to initialize Stripe:', error);
}

export async function POST(request: NextRequest) {
  // Ensure Stripe is initialized
  if (!stripe || !endpointSecret) {
    console.error('Stripe is not properly initialized');
    return NextResponse.json(
      { error: 'Stripe configuration is missing' },
      { status: 500 }
    );
  }

  try {
    const signature = request.headers.get('stripe-signature') || '';
    const body = await request.text();

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCompletedCheckout(session);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent was successful:', paymentIntent.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCompletedCheckout(session: Stripe.Checkout.Session) {
  // Here you would typically:
  // 1. Create or update order in your database
  // 2. Update inventory
  // 3. Send confirmation email
  
  console.log('Checkout session completed:', session.id);
  
  // Example: Record the order in your database
  /*
  const supabase = createClient();
  await supabase.from('orders').insert({
    stripe_session_id: session.id,
    customer_email: session.customer_details?.email,
    amount_total: session.amount_total,
    payment_status: session.payment_status,
    shipping_details: session.shipping_details,
    metadata: session.metadata,
    created_at: new Date().toISOString()
  });
  */
}

// GET handler for session verification
export async function GET(request: NextRequest) {
  // Ensure Stripe is initialized
  if (!stripe) {
    console.error('Stripe is not properly initialized');
    return NextResponse.json(
      { error: 'Stripe configuration is missing' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json({ success: false, error: 'No session ID provided' });
  }
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return NextResponse.json({ success: false, error: 'Invalid session ID' });
    }
    
    // You can fetch additional order details from your database here
    
    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        payment_status: session.payment_status
      }
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json({ success: false, error: 'Error retrieving session' });
  }
} 