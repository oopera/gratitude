import { auth } from "@/app/(auth)/auth";

import { NoticeOverview } from "@/components/custom/overviews/notice-overview";
import { getUser } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.name) {
    return redirect("/login");
  }
  const user = await getUser(session?.user?.name);
  const userCondition = user[0]?.condition;

  if (!userCondition) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center">
        <Image
          src="/images/logo.png"
          height={250}
          width={1500}
          alt="Logo"
          className="w-full max-w-[500px]"
        />
        <div className="flex flex-col h-full w-dvw items-center gap-4">
          <NoticeOverview />
        </div>
      </div>
    </div>
  );
}
