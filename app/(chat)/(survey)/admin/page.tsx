import { auth } from "@/app/(auth)/auth";
import { AdminOverview } from "@/components/custom/overviews/admin-overview";
import { Button } from "@/components/ui/button";
import { getChatsByType, getUser, getUsers } from "@/db/queries";
import { Download } from "lucide-react";
import { redirect } from "next/navigation";
export default async function Page() {
  const session = await auth();

  if (!session?.user?.name) {
    return redirect("/register");
  }
  const user = await getUser(session?.user?.name);
  const userType = user[0]?.type;

  if (userType !== "admin") {
    return redirect("/");
  }

  const conditionOneChats = await getChatsByType({ type: "condition_one" });
  const conditionTwoChats = await getChatsByType({ type: "condition_two" });
  const controlChats = await getChatsByType({ type: "control" });
  const users = await getUsers();

  const downloadChats = () => {
    const chats = {
      conditionOneChats,
      conditionTwoChats,
      controlChats,
    };
    const json = JSON.stringify(chats);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chats.json";
    a.click();
  };

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-col h-full w-dvw items-center gap-4">
          <AdminOverview />

          <div className="grid w-full md:max-w-[500px] grid-cols-2 gap-4 px-4 md:mx-0">
            <div className="w-full border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
              <div className="grid grid-cols-2 gap-2">
                <h3>Chats</h3>
                <Button
                  variant="outline"
                  // onClick={() => {
                  // downloadChats();

                  // }}
                >
                  <Download />
                </Button>
              </div>
              <p>Condition One: {conditionOneChats.length}</p>
              <p>Condition Two: {conditionTwoChats.length}</p>
              <p>Control: {controlChats.length}</p>
            </div>
            <div className="w-full border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
              <div className="grid grid-cols-2 gap-2">
                <h3>Users</h3>
                <Button
                  variant="outline"
                  // onClick={() => {
                  // downloadChats();

                  // }}
                >
                  <Download />
                </Button>
              </div>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto overflow-x-hidden pr-10">
                {users
                  .sort((a, b) => {
                    if (a.type === "admin") return -1;
                    if (b.type === "admin") return 1;
                    if (a.type === "control") return -1;
                    if (b.type === "control") return 1;
                    if (a.type === "condition_one") return -1;
                    return 1;
                  })
                  .map((user) => (
                    <div className="grid grid-cols-2 gap-2" key={user.id}>
                      <p className="font-bold max-w-full truncate">
                        {user.name}
                      </p>
                      <p>{user.type}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
