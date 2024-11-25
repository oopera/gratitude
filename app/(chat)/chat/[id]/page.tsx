import { CoreMessage } from "ai";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/app/(auth)/auth";
import { Chat as PreviewChat } from "@/components/custom/chat";
import { Navbar } from "@/components/custom/navbar";
import { getChatById, getUser } from "@/db/queries";
import { Chat } from "@/db/schema";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { convertToUIMessages } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function Page(props: { params: Promise<any> }) {
  const params = await props.params;
  const { id } = params;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    notFound();
  }

  // type casting
  const chat: Chat = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  const session = await auth();

  if (!session?.user?.name) {
    return redirect("/register");
  }
  const user = await getUser(session?.user?.name);
  const userType = user[0]?.type;

  if (!userType) {
    return redirect("/register");
  }

  const chatType = chat.type;

  let selectedModelId = DEFAULT_MODEL_NAME;
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  const cookieModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  const modelMapping: Record<string, string> = {
    condition_one: "condition_one",
    condition_two: "condition_two",
    control: "control",
    admin: cookieModelId,
  };

  const modelId = modelMapping[chatType];

  selectedModelId =
    modelId ??
    models.find((model) => model.id === modelMapping[userType])?.id ??
    DEFAULT_MODEL_NAME;

  return (
    <>
      <Navbar userType={userType} selectedModelId={selectedModelId} />
      <PreviewChat
        userType={userType}
        id={chat.id}
        initialMessages={chat.messages}
        selectedModelId={selectedModelId}
      />
    </>
  );
}
