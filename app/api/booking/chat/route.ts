export const dynamic = 'force-dynamic';

interface ChatMessage {
  email: string;
  message: string;
  timestamp: string;
}

// In-memory chat storage (in production, use database)
let chatHistory: ChatMessage[] = [];

// Pre-defined responses for common booking questions
const responses: { [key: string]: string } = {
  'price': 'My rates vary based on the type of event and location. Contact me directly for a custom quote.',
  'available': 'I\'m currently booking for 2024-2025. Let me know your desired date and I\'ll check availability!',
  'performance': 'I specialize in DJ performances, styling, and creative direction. What type of event are you planning?',
  'wedding': 'I\'ve styled for many weddings and high-profile events. I\'d love to discuss your vision!',
  'hire': 'To book me, please fill out the form on the left with your event details. I\'ll follow up within 24 hours.',
  'default': 'Thanks for your interest! I\'ll be reviewing your inquiry and will get back to you soon. What else can I help with?'
};

function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  for (const [keyword, response] of Object.entries(responses)) {
    if (lowerMessage.includes(keyword)) {
      return response;
    }
  }

  return responses['default'];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, email } = body;

    if (!message || !email) {
      return Response.json(
        { error: 'Missing message or email' },
        { status: 400 }
      );
    }

    // Store chat message
    chatHistory.push({
      email,
      message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with OpenClaw to:
    // 1. Log chat messages to CRM
    // 2. Send notifications to Tasha
    // 3. Track conversation history per contact

    // Generate response
    const reply = generateResponse(message);

    return Response.json({
      success: true,
      reply: reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    return Response.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({
        success: true,
        totalMessages: chatHistory.length,
        messages: chatHistory,
      });
    }

    const userMessages = chatHistory.filter(msg => msg.email === email);

    return Response.json({
      success: true,
      email,
      messages: userMessages,
    });
  } catch (error) {
    console.error('Chat fetch error:', error);
    return Response.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
