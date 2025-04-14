import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { StripeProduct } from '@/models/product';

// Prevent this route from being statically generated for export
export const dynamic = "error";

// Initialize Stripe without specifying an API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { cartItems, shippingAddress, paymentMethod } = await request.json();
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Invalid cart items provided' },
        { status: 400 }
      );
    }

    // Format line items for Stripe
    const lineItems = cartItems.map((item: StripeProduct) => ({
      price_data: {
        currency: 'sar',
        product_data: {
          name: item.name,
          description: item.description || undefined,
          images: item.images || [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // حساب المبلغ الإجمالي للطلب
    const totalAmount = cartItems.reduce(
      (total: number, item: StripeProduct) => 
        total + (item.price * (item.quantity || 1)), 
      0
    );

    // Handle different payment methods
    if (paymentMethod === 'mada') {
      // إنشاء رابط للدفع بمدى
      const mockMadaCheckoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/redirect?provider=mada&mock=true`;
      
      // في بيئة الإنتاج، ستستدعي واجهة برمجة التطبيقات الخاصة بمدى هنا
      // مثال: const madaSession = await madaClient.createCheckout({ ... })
      
      // إنشاء معرف فريد للطلب
      const orderReference = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      return NextResponse.json({ 
        url: `${mockMadaCheckoutUrl}&reference=${orderReference}`,
        provider: 'mada',
        orderReference
      });
    }
    
    if (paymentMethod === 'apple_pay') {
      // في بيئة الإنتاج، ستقوم بمعالجة دفعة Apple Pay من واجهة المستخدم
      // هنا نقوم فقط بتهيئة المعلومات اللازمة للعميل
      
      return NextResponse.json({ 
        status: 'ready',
        provider: 'apple_pay',
        amount: totalAmount,
        merchantIdentifier: process.env.APPLE_PAY_MERCHANT_ID || 'merchant.com.heldenstore',
        merchantName: 'Helden Store',
        countryCode: 'SA',
        currencyCode: 'SAR'
      });
    }
    
    if (paymentMethod === 'tabby') {
      // Tabby integration would normally go here
      // For now, we'll create a mock URL to simulate the integration
      const mockTabbyCheckoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/redirect?provider=tabby&mock=true`;
      
      // In a real implementation, you would use the Tabby SDK/API to create a checkout session
      // Example: const tabbySession = await tabbyClient.createCheckout({ ... })
      
      return NextResponse.json({ 
        url: mockTabbyCheckoutUrl,
        provider: 'tabby'
      });
    } 
    
    if (paymentMethod === 'tamara') {
      // Tamara integration would normally go here
      // For now, we'll create a mock URL to simulate the integration
      const mockTamaraCheckoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/redirect?provider=tamara&mock=true`;
      
      // In a real implementation, you would use the Tamara SDK/API to create a checkout session
      // Example: const tamaraSession = await tamaraClient.createCheckout({ ... })
      
      return NextResponse.json({ 
        url: mockTamaraCheckoutUrl,
        provider: 'tamara'
      });
    }
    
    if (paymentMethod === 'cod') {
      // For Cash on Delivery, create an order directly in the database
      // This would typically involve:
      // 1. Validating the customer is logged in
      // 2. Creating an order record
      // 3. Creating order items
      // 4. Sending confirmation email
      
      // For now, we'll just return a success response with a mock order ID
      const mockOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      return NextResponse.json({ 
        success: true,
        orderId: mockOrderId,
        message: 'Cash on delivery order created successfully'
      });
    }

    // Default to Stripe for other payment methods
    // Create checkout session with proper payment method configuration
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ['SA'], // Saudi Arabia
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500, // 15 SAR
              currency: 'sar',
            },
            display_name: 'Standard Delivery',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 3000, // 30 SAR
              currency: 'sar',
            },
            display_name: 'Express Delivery',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 2,
              },
            },
          },
        },
      ],
      payment_intent_data: {
        capture_method: 'automatic',
        metadata: {
          payment_method: paymentMethod,
        },
      },
      metadata: {
        payment_method: paymentMethod,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Handle payment methods endpoint
  if (path.endsWith('/payment-methods')) {
    return NextResponse.json({
      payment_methods: [
        {
          id: 'mada',
          name: 'مدى (Mada)',
          icon: '/images/payment/mada.png',
          enabled: true,
          type: 'card',
          description: 'الدفع باستخدام بطاقة مدى'
        },
        {
          id: 'apple_pay',
          name: 'Apple Pay',
          icon: '/images/payment/apple-pay.png',
          enabled: true,
          type: 'wallet',
          description: 'الدفع بسرعة وأمان باستخدام Apple Pay'
        },
        {
          id: 'visa_mastercard',
          name: 'بطاقة ائتمان',
          icon: '/images/payment/visa-mastercard.png',
          enabled: true,
          type: 'card',
          description: 'الدفع باستخدام Visa أو MasterCard'
        },
        {
          id: 'tabby',
          name: 'قسّم على 4 دفعات مع Tabby',
          icon: '/images/payment/tabby.png',
          enabled: true,
          type: 'bnpl',
          description: 'قسّم على 4 دفعات بدون فوائد'
        },
        {
          id: 'tamara',
          name: 'ادفع لاحقاً مع تمارا',
          icon: '/images/payment/tamara.png',
          enabled: true,
          type: 'bnpl',
          description: 'ادفع بعد 30 يوم أو قسّم على 3 دفعات'
        },
        {
          id: 'cod',
          name: 'الدفع عند الاستلام',
          icon: '/images/payment/cod.png',
          enabled: true,
          type: 'cod',
          description: 'ادفع نقداً عند استلام طلبك'
        }
      ]
    });
  }
  
  // Default response for other GET requests
  return NextResponse.json({ status: 'Checkout API is running' });
} 