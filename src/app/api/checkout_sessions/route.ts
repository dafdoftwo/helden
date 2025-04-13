import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { StripeProduct } from '@/models/product';

export async function POST(req: Request) {
  try {
    const { items, paymentMethod } = await req.json();
    
    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    
    // Format line items for Stripe
    const lineItems = items.map((item: StripeProduct) => ({
      price_data: {
        currency: 'sar',
        product_data: {
          name: item.name,
          images: item.images ? [item.images[0]] : [],
          description: item.description,
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));
    
    // Setup payment method types based on selected method
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = ['card'];
    
    // Add specific payment methods if requested
    if (paymentMethod === 'mada') {
      paymentMethodTypes.push('card');
    } else if (paymentMethod === 'apple_pay') {
      paymentMethodTypes.push('card');
    }
    
    // Create checkout session with parameters
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ['SA', 'AE', 'KW', 'BH', 'QA', 'OM'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 3000, // 30 SAR
              currency: 'sar',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 6000, // 60 SAR
              currency: 'sar',
            },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      locale: 'auto',
    };
    
    // Special payment method handling for Mada and Apple Pay
    if (paymentMethod === 'mada') {
      sessionParams.payment_method_options = {
        card: {
          installments: {
            enabled: true,
          },
        },
      };
    }
    
    const session = await stripe.checkout.sessions.create(sessionParams);
    
    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 