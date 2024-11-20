import { Chat } from "@/components/custom/chat";
import { Navbar } from "@/components/custom/navbar";
import { getUser } from "@/db/queries";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { notFound } from "next/navigation";
import { auth } from "../(auth)/auth";

export default async function Page() {
  const id = generateUUID();
  const session = await auth();

  if (!session?.user?.name) {
    return notFound();
  }
  const user = await getUser(session?.user?.name);
  const userType = user[0]?.type;

  if (!userType) {
    return notFound();
  }

  let selectedModelId = DEFAULT_MODEL_NAME;

  const modelMapping: Record<string, string> = {
    condition_one: "condition_one",
    condition_two: "condition_two",
    control: "control",
  };

  selectedModelId =
    models.find((model) => model.id === modelMapping[userType])?.id ??
    DEFAULT_MODEL_NAME;

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
