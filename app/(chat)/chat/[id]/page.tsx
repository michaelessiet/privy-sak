import { cookies } from "next/headers";
import { notFound, unauthorized } from "next/navigation";

import { auth } from "@/app/(auth)/auth";
import { Chat } from "@/components/chat";
import {
  getChatById,
  getMessagesByChatId,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import type { DBMessage } from "@/lib/db/schema";
import type { Attachment, UIMessage } from "ai";
import { generateUUID } from "@/lib/utils";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ input: string }>;
}) {
  const params = await props.params;
  const { input } = await props.searchParams;

  const { id } = params;
  let chat = await getChatById({ id });
  const session = await auth();

  if (!session?.user?.id) {
    return unauthorized();
  }

  if (!chat) {
    if (input) {
      await saveChat({
        id: params.id,
        userId: session.user.id,
        title: input.slice(0, 20),
      });
      await saveMessages({
        messages: [
          {
            id: generateUUID(),
            chatId: id,
            role: "user",
            attachments: [],
            parts: [{ type: "text", text: input }],
            createdAt: new Date(),
          },
        ],
      });

      chat = await getChatById({ id });
    } else {
      notFound();
    }
  }

  if (chat.visibility === "private") {
    if (!session || !session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      parts: message.parts as UIMessage["parts"],
      role: message.role as UIMessage["role"],
      // Note: content will soon be deprecated in @ai-sdk/react
      content: "",
      createdAt: message.createdAt,
      experimental_attachments:
        (message.attachments as Array<Attachment>) ?? [],
    }));
  }

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get("chat-model");

  if (!chatModelFromCookie) {
    return (
      <>
        <Chat
          id={chat.id}
          initialMessages={convertToUIMessages(messagesFromDb)}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType={chat.visibility}
          isReadonly={session?.user?.id !== chat.userId}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messagesFromDb)}
        selectedChatModel={chatModelFromCookie.value}
        selectedVisibilityType={chat.visibility}
        isReadonly={session?.user?.id !== chat.userId}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
