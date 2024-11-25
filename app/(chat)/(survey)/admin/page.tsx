import { auth } from "@/app/(auth)/auth";
import Chats from "@/components/custom/dashboard/chats";
import Users from "@/components/custom/dashboard/users";
import { Navbar } from "@/components/custom/navbar";
import { AdminOverview } from "@/components/custom/overviews/admin-overview";
import { getChatsByType, getUser, getUsers } from "@/db/queries";
import { Chat, User } from "@/db/schema";
import { redirect } from "next/navigation";
export default async function Page() {
  const session = await auth();

  if (!session?.user?.name) {
    return redirect("/login");
  }
  const user = await getUser(session?.user?.name);
  const userCondition = user[0]?.condition;
  const userType = user[0]?.type;

  if (userCondition !== "admin") {
    return redirect("/");
  }

  const conditionOneChats = await getChatsByType({ type: "condition_one" });
  const conditionTwoChats = await getChatsByType({ type: "condition_two" });
  const controlChats = await getChatsByType({ type: "control" });
  const users = await getUsers();

  return (
    <>
      <Navbar userCondition={userCondition} userType={userType} />
      <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
        <div className="flex flex-col justify-between items-center">
          <div className="flex flex-col h-full w-dvw items-center gap-4">
            <AdminOverview />

            <div className="flex flex-col lg:grid w-full max-h-[400px] lg:grid-cols-2 gap-4 px-4 md:mx-0">
              <Chats
                conditionOneChats={conditionOneChats as Chat[]}
                conditionTwoChats={conditionTwoChats as Chat[]}
                controlChats={controlChats as Chat[]}
              />
              <Users users={users as User[]} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
