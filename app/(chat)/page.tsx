import { Chat } from "@/components/custom/chat";
import { Journal } from "@/components/custom/journal";
import { Navbar } from "@/components/custom/navbar";
import { getUser } from "@/db/queries";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { generateUUID } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../(auth)/auth";

export default async function Page() {
  const id = generateUUID();
  const session = await auth();

  if (!session?.user?.name) {
    return redirect("/login");
  }
  const user = await getUser(session?.user?.name);
  const userType = user[0]?.type;

  if (!userType) {
    return redirect("/login");
  }

  let selectedModelId = DEFAULT_MODEL_NAME;
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  const cookieModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  const modelMapping: Record<string, string> = {
    condition_one: "condition_one",
    condition_two: "condition_two",
    condition_three: "condition_three",
    control: "control",
    admin: cookieModelId,
  };

  selectedModelId =
    models.find((model) => model.id === modelMapping[userType])?.id ??
    DEFAULT_MODEL_NAME;

  return (
    <>
      <Navbar userType={userType} selectedModelId={selectedModelId} />
      {selectedModelId !== "control" && (
        <Chat
          userType={userType}
          key={id}
          id={id}
          initialMessages={[]}
          selectedModelId={selectedModelId}
        />
      )}
      {selectedModelId === "control" && (
        <Journal
          userType={userType}
          key={id}
          id={id}
          initialMessages={[]}
          selectedModelId={selectedModelId}
        />
      )}
    </>
  );
}
