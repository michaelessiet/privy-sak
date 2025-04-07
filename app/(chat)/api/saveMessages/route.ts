import { saveMessages } from "@/lib/db/queries";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    await saveMessages({
      messages: messages.map((message: any) => ({
        ...message,
        createdAt: new Date(message.createdAt || Date.now()),
      })),
    });

    return new Response("Messages saved successfully", { status: 200 });
  } catch (e) {
    console.error("Error saving messages:", e);
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}
