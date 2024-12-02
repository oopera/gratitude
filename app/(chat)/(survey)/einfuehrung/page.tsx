import { auth } from "@/app/(auth)/auth";
import { IntroOverview } from "@/components/custom/overviews/intro-overview";
import { getUser } from "@/db/queries";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.name) {
    return redirect("/login");
  }
  const user = await getUser(session?.user?.name);
  const userType = user[0]?.type;
  const userCondition = user[0]?.condition;

  if (!userCondition) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-col h-full w-dvw items-center gap-4">
          <IntroOverview userCondition={userCondition} />
        </div>
      </div>
    </div>
  );
}
