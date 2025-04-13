import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface TrackingInfo {
  trackingNumber: string;
  provider: string;
  status: string;
  estimatedDelivery: string;
  events: {
    date: string;
    status: string;
    location: string;
    description: string;
  }[];
  trackingUrl?: string;
}

export async function GET(request: Request) {
  try {
    // Get tracking number from URL parameters
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('tracking_number');
    
    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      );
    }

    // Get the order associated with this tracking number
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('tracking_number', trackingNumber)
      .single();
      
    if (orderError) {
      console.error('Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Order not found for this tracking number' },
        { status: 404 }
      );
    }
    
    // Get tracking events
    const { data: eventsData, error: eventsError } = await supabase
      .from('shipping_events')
      .select('*')
      .eq('tracking_number', trackingNumber)
      .order('timestamp', { ascending: true });
    
    if (eventsError) {
      console.error('Error fetching shipping events:', eventsError);
      return NextResponse.json(
        { error: 'Failed to get tracking information' },
        { status: 500 }
      );
    }
    
    // Get the shipping provider details
    const { data: providerData, error: providerError } = await supabase
      .from('shipping_options')
      .select('*')
      .eq('provider', orderData.shipping_provider)
      .single();
    
    // Format the tracking information
    const trackingInfo: TrackingInfo = {
      trackingNumber,
      provider: orderData.shipping_provider,
      status: orderData.shipping_status,
      estimatedDelivery: orderData.estimated_delivery_date,
      events: eventsData.map((event) => ({
        date: event.timestamp,
        status: event.status,
        location: event.location,
        description: event.description,
      })),
    };
    
    // Add the tracking URL if available
    if (!providerError && providerData) {
      trackingInfo.trackingUrl = providerData.tracking_url_template.replace(
        '{tracking_number}',
        trackingNumber
      );
    }
    
    return NextResponse.json(trackingInfo);
  } catch (error) {
    console.error('Error in tracking API:', error);
    return NextResponse.json(
      { error: 'Failed to get tracking information' },
      { status: 500 }
    );
  }
} 