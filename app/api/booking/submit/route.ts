export const dynamic = 'force-dynamic';

interface BookingRequest {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  budget: string;
  details: string;
}

// In-memory storage for bookings (in production, use database + OpenClaw integration)
let bookings: BookingRequest[] = [];

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.eventType) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store booking
    bookings.push(body);

    // TODO: Integrate with OpenClaw to:
    // 1. Send confirmation email to client
    // 2. Send notification to Tasha
    // 3. Add email to mailing list
    // 4. Create CRM record for follow-up

    // Example OpenClaw integration (pseudo-code):
    // await openClaw.sendEmail({
    //   to: body.email,
    //   template: 'booking-confirmation',
    //   data: body
    // });
    //
    // await openClaw.addToList('bookings', body.email);
    // await openClaw.createContact(body);

    return Response.json({
      success: true,
      message: 'Booking request submitted successfully',
      bookingId: bookings.length,
    });
  } catch (error) {
    console.error('Booking submission error:', error);
    return Response.json(
      { error: 'Failed to submit booking' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    success: true,
    totalBookings: bookings.length,
    bookings: bookings,
  });
}
