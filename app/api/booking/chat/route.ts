import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for chat messages
let chatMessages: Array<{
  email: string;
  message: string;
  timestamp: string;
  sender: 'user' | 'tasha';
}> = [];

// Common responses for Tasha's auto-responses
const autoResponses: Record<string, string> = {
  price: "Thank you for your interest! Pricing varies based on your event type, duration, and specific needs. I'll be in touch soon with a custom quote.",
  availability: "I appreciate your interest! Let me check my calendar and get back to you with available dates shortly.",
  performance: "I'd love to discuss what you're looking for! My performances are tailored to your event. Tell me more about your vision.",
  hiring: "Thank you for considering me! I work with clients on a case-by-case basis. Let's discuss your project in detail.",
  booking: "Thank you for reaching out! I'm excited to learn more about your event. I'll follow up with you shortly with details.",
  default: "Thank you for your message! I appreciate your interest and will get back to you as soon as possible.",
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (email) {
    const userMessages = chatMessages.filter(msg => msg.email === email);
    return NextResponse.json({ messages: userMessages }, { status: 200 });
  }

  return NextResponse.json({ messages: chatMessages }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, message } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store user message
    const userMessage = {
      email,
      message,
      timestamp: new Date().toISOString(),
      sender: 'user' as const,
    };

    chatMessages.push(userMessage);

    // Generate auto-response
    const messageLower = message.toLowerCase();
    let responseText = autoResponses.default;

    if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('rate')) {
      responseText = autoResponses.price;
    } else if (messageLower.includes('available') || messageLower.includes('when') || messageLower.includes('date')) {
      responseText = autoResponses.availability;
    } else if (messageLower.includes('perform') || messageLower.includes('music') || messageLower.includes('dj')) {
      responseText = autoResponses.performance;
    } else if (messageLower.includes('hire') || messageLower.includes('work') || messageLower.includes('collaborate')) {
      responseText = autoResponses.hiring;
    } else if (messageLower.includes('book') || messageLower.includes('event')) {
      responseText = autoResponses.booking;
    }

    // Store Tasha's auto-response
    const tashaResponse = {
      email,
      message: responseText,
      timestamp: new Date().toISOString(),
      sender: 'tasha' as const,
    };

    chatMessages.push(tashaResponse);

    // TODO: Integrate with OpenClaw for:
    // - Sending email notification to Tasha about new message
    // - Logging conversation to CRM

    return NextResponse.json(
      {
        success: true,
        userMessage,
        tashaResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Chat submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
