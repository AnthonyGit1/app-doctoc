import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // URL del endpoint real de Doctoc
    const doctocUrl = 'https://us-central1-doctoc-main.cloudfunctions.net/managePatientsAPIV2';
    
    // Token de autorización
    const bearerToken = 'PRk2P5dbYptiss5w2U8jdVPu9DAHXcoWmFrl3lDmGMthqfgtjePvJk6MacyiPPlK';
    
    const response = await fetch(doctocUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: `API Error: ${response.status} ${response.statusText}`,
        details: data
      }, { status: response.status });
    }

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error interno del servidor' 
    }, { status: 500 });
  }
}