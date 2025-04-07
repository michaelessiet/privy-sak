import { auth } from "@/app/(auth)/auth";
import { saveChat } from "@/lib/db/queries";

export async function POST(request: Request) {
  const { id, title } = await request.json();
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await saveChat({ id, userId: session.user.id, title });
    return new Response("Chat saved successfully", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}
