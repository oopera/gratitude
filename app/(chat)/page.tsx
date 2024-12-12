import { Chat } from "@/components/custom/chat";
import { Journal } from "@/components/custom/journal";
import { Navbar } from "@/components/custom/navbar";
import { getLatestUserChat, getUser } from "@/db/queries";
import { generateUUID } from "@/lib/utils";
import { redirect } from "next/navigation";

import { NoticeOverview } from "@/components/custom/overviews/notice-overview";
import { getModelMapping } from "@/lib/ai/mappings";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { cookies } from "next/headers";
import { auth } from "../(auth)/auth";
import SignOut from "../(auth)/signout";
import SignOutComplete from "../(auth)/signoutcomplete";

export default async function Page() {
  const id = generateUUID();
  const session = await auth();

  if (!session?.user?.name) {
    return redirect("/login");
  }
  const user = await getUser(session?.user?.name);
  const userType = user[0]?.type;
  const userCondition = user[0]?.condition;

  if (!userType || !userCondition) {
    <SignOut />;
  }
  console.log(session?.user?.name);
  const chat = await getLatestUserChat(session?.user?.name);

  if (chat.error) {
    <SignOut />;
  }
  const latestUserchat = chat[0];

  const currenDate = new Date();

  if (userType === "short" && latestUserchat) {
    return <SignOutComplete />;
  }

  if (
    userCondition !== "admin" &&
    latestUserchat &&
    latestUserchat.createdAt.getDate() === currenDate.getDate()
  ) {
    return (
      <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
        <Navbar userType={userType} userCondition={userCondition} />
        <div className="flex flex-col justify-between items-center">
          <div className="flex flex-col h-full w-dvw items-center gap-4">
            <NoticeOverview />
          </div>
        </div>
      </div>
    );
  }

  let selectedModelId = DEFAULT_MODEL_NAME;
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  const cookieModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  const modelId = getModelMapping(cookieModelId)[userCondition];

  selectedModelId =
    modelId ??
    models.find((model) => model.id === modelId)?.id ??
    DEFAULT_MODEL_NAME;

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
          selectedModelId={selectedModelId}
        />
      )}
      {selectedModelId === "control" && (
        <Journal
          userType={userType}
          userCondition={userCondition}
          key={id}
          id={id}
          initialMessages={[]}
          selectedModelId={selectedModelId}
        />
      )}
    </>
  );
}
