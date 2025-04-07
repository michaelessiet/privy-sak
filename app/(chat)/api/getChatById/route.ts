import { auth } from "@/app/(auth)/auth";
import { getChatById } from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (!chat) {
      return new Response(
        JSON.stringify({ status: 404, error: "chat not found" }),
        { status: 404 }
      );
    }

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("An error occurred while processing your request!", {
      status: 500,
    });
  }
}
