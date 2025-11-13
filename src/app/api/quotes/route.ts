import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '../../../config/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Hacer la llamada a la API real de Doctoc
    const response = await fetch(`${API_CONFIG.BASE_URL}/manageQuotesAPIV2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer PRk2P5dbYptiss5w2U8jdVPu9DAHXcoWmFrl3lDmGMthqfgtjePvJk6MacyiPPlK',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}