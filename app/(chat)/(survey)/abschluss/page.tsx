import { CompleteOverview } from "@/components/custom/overviews/complete-overview";

export default async function Page() {
  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-col h-full w-dvw items-center gap-4">
          <CompleteOverview />
        </div>
      </div>
    </div>
  );
}
