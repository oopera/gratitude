import { CoreMessage } from "ai";
import { redirect } from "next/navigation";

import { auth } from "@/app/(auth)/auth";

import SignOut from "@/app/(auth)/signout";
import { Chat } from "@/components/custom/chat";
import { Journal } from "@/components/custom/journal";
import { Navbar } from "@/components/custom/navbar";
import { getChatById, getUser } from "@/db/queries";
import { Chat as ChatSchema } from "@/db/schema";
import { getModelMapping } from "@/lib/ai/mappings";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { convertToUIMessages } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function Page(props: { params: Promise<any> }) {
  const params = await props.params;
  const { id } = params;
  const chatFromDb = await getChatById({ id });

  if (!chatFromDb) {
    return redirect("/");
  }

  const chat: ChatSchema = {
    ...chatFromDb,
    messages: convertToUIMessages(chatFromDb.messages as Array<CoreMessage>),
  };

  const session = await auth();

  if (!session?.user?.name) {
    return redirect("/login");
  }

  const user = await getUser(session?.user?.name);

  if (user.length === 0) {
    <SignOut />;
  }

  const userType = user[0]?.type;
  const userCondition = user[0]?.condition;

  const chatType = chat.type;

  let selectedModelId = DEFAULT_MODEL_NAME;
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  const cookieModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  const modelId = getModelMapping(cookieModelId)[chatType];

  selectedModelId = modelId ?? models.find((model) => model.id === modelId)?.id;

  return (
    <>
      <Navbar
        userType={userType}
        userCondition={userCondition}
        selectedModelId={selectedModelId}
      />
      {selectedModelId !== "control" && (
        <Chat
          userType={userType}
          userCondition={userCondition}
          key={id}
          id={id}
          initialMessages={chat.messages}
          selectedModelId={selectedModelId}
        />
      )}
      {selectedModelId === "control" && (
        <Journal
          userType={userType}
          userCondition={userCondition}
          key={id}
          id={id}
          initialMessages={chat.messages}
          selectedModelId={selectedModelId}
        />
      )}
    </>
  );
}
