import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for bookings
let bookings: Array<{
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  budget: string;
  details: string;
  submittedAt: string;
}> = [];

export async function GET() {
  return NextResponse.json({ bookings }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, eventType, eventDate, budget, details } = body;

    // Validate required fields
    if (!name || !email || !eventType || !details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const booking = {
      name,
      email,
      phone: phone || '',
      eventType,
      eventDate: eventDate || '',
      budget: budget || '0',
      details,
      submittedAt: new Date().toISOString(),
    };

    bookings.push(booking);

    // TODO: Integrate with OpenClaw for:
    // - Sending booking confirmation email to Tasha
    // - Adding contact to mailing list
    // - Creating CRM record

    return NextResponse.json(
      {
        success: true,
        message: 'Booking submitted successfully',
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}
