import { auth } from "@/app/(auth)/auth";
import Dashboard from "@/components/custom/dashboard/dashboard";
import { Navbar } from "@/components/custom/navbar";
import { AdminOverview } from "@/components/custom/overviews/admin-overview";
import { getChatsByType, getUser, getUsers } from "@/db/queries";
import { Chat } from "@/db/schema";
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

  const shortChats = await getChatsByType({ type: "short" });
  const longChats = await getChatsByType({ type: "long" });

  // const conditionOneChats = await getChatsByCondition({ condition: "1" });
  // const conditionTwoChats = await getChatsByCondition({ condition: "2" });
  // const controlChats = await getChatsByCondition({ condition: "control" });
  const users = await getUsers();

  return (
    <>
      <Navbar userCondition={userCondition} userType={userType} />
      <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
        <div className="flex flex-col justify-between items-center">
          <div className="flex flex-col h-full w-dvw items-center gap-4">
            <AdminOverview />

            <Dashboard
              users={users}
              chats={{
                shortChats: shortChats as Chat[],
                longChats: longChats as Chat[],
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
