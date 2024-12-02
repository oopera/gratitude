import { IntroOverview } from "@/components/custom/overviews/intro-overview";

export default async function Page() {
  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-col h-full w-dvw items-center gap-4">
          <IntroOverview />
        </div>
      </div>
    </div>
  );
}
