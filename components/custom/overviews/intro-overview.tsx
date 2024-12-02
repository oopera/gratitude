"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const IntroOverview = () => {
  const router = useRouter();
  return (
    <div key="overview" className="w-full md:max-w-[500px] mt-20 px-4 md:mx-0">
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <h1 className="text-2xl font-bold">Willkommen. </h1>
        <p>
          Willkommen zu unserem Dankbarkeitsjournal.
          <br />
          Auf der folgenden Seite werden ihnen einige Fragen bezüglich
          dankbarkeit gestellt. Es gibt keine richtigen oder falschen Antworten,
          es geht nur darum, wie Sie sich fühlen.
          <br /> <br />
          Am besten suchen Sie sich einen ruhigen Ort, an dem Sie sich
          wohlfühlen und ungestört sind.
          <br /> <br />
          Bitte beantworten Sie die Fragen in Ruhe und ehrlich.
        </p>
        <Button onClick={() => router.push("/")}>{`Los geht's`}</Button>
      </div>
    </div>
  );
};
