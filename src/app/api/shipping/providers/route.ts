import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  try {
    // Get available shipping providers from database
    const { data: providers, error } = await supabase
      .from('shipping_providers')
      .select('*')
      .order('priority', { ascending: true });

    if (error) {
      console.error('Error fetching shipping providers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch shipping providers' },
        { status: 500 }
      );
    }

    // Return the shipping providers
    return NextResponse.json({
      providers: providers || [],
    });
  } catch (error) {
    console.error('Unexpected error in shipping providers API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { address, items, provider } = await req.json();

    // Validate required fields
    if (!address || !items || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get shipping provider details from database
    const { data: providerDetails, error: providerError } = await supabase
      .from('shipping_providers')
      .select('*')
      .eq('id', provider)
      .single();

    if (providerError || !providerDetails) {
      console.error('Error fetching shipping provider:', providerError);
      return NextResponse.json(
        { error: 'Invalid shipping provider' },
        { status: 400 }
      );
    }

    // Calculate shipping cost based on address and items
    const shippingCost = calculateShippingCost(address, items, providerDetails);

    // Create shipping record
    const { data: shipping, error: shippingError } = await supabase
      .from('shipping')
      .insert({
        provider_id: provider,
        address: address,
        cost: shippingCost,
        status: 'pending',
        estimated_delivery: getEstimatedDeliveryDate(providerDetails.delivery_days),
      })
      .select()
      .single();

    if (shippingError) {
      console.error('Error creating shipping record:', shippingError);
      return NextResponse.json(
        { error: 'Failed to create shipping record' },
        { status: 500 }
      );
    }

    // Return shipping details
    return NextResponse.json({
      shipping_id: shipping.id,
      provider: providerDetails.name,
      cost: shippingCost,
      estimated_delivery: shipping.estimated_delivery,
      tracking_number: shipping.tracking_number || null,
    });
  } catch (error) {
    console.error('Unexpected error in shipping creation API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// Helper function to calculate shipping cost
function calculateShippingCost(address: any, items: any[], providerDetails: any) {
  // Base cost from the provider
  let cost = providerDetails.base_cost;

  // Additional cost based on total weight/volume
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0);
  const weightCost = totalWeight * providerDetails.cost_per_kg;

  // Region-based adjustment
  const regionMultiplier = getRegionMultiplier(address.city);
  
  // Calculate final cost
  const finalCost = (cost + weightCost) * regionMultiplier;
  
  // Round to 2 decimal places
  return Math.round(finalCost * 100) / 100;
}

// Helper function to get region-specific multiplier
function getRegionMultiplier(city: string) {
  // Default multiplier is 1.0
  const defaultMultiplier = 1.0;
  
  // Define region multipliers (could be moved to database)
  const regionMultipliers: Record<string, number> = {
    'Riyadh': 1.0,
    'Jeddah': 1.1,
    'Dammam': 1.15,
    'Mecca': 1.2,
    'Medina': 1.2,
    // Add more cities as needed
  };
  
  return regionMultipliers[city] || defaultMultiplier;
}

// Helper function to calculate estimated delivery date
function getEstimatedDeliveryDate(deliveryDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + deliveryDays);
  return date.toISOString();
} 