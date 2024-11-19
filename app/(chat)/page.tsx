import { cookies } from "next/headers";

import { Chat } from "@/components/custom/chat";
import { Navbar } from "@/components/custom/navbar";
import { getUser } from "@/db/queries";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { notFound } from "next/navigation";
import { auth } from "../(auth)/auth";

export default async function Page() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  const session = await auth();

  if (!session?.user?.name) {
    return notFound();
  }
  const user = await getUser(session?.user?.name);

  if (!user) {
    return notFound();
  }

  const userType = user[0]?.type;

  return (
    <>
      <Navbar userType={userType} selectedModelId={selectedModelId} />
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedModelId={selectedModelId}
      />
    </>
  );
}
