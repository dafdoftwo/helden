import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'success', 
    message: 'This is an empty page placeholder' 
  });
}

export const dynamic = 'force-static'; 