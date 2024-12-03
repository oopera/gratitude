"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const IntroOverview = ({ userCondition }: { userCondition: string }) => {
  const router = useRouter();
  return (
    <div
      key="overview"
      className="w-full md:max-w-[500px] mt-20 px-4 md:mx-0 gap-4">
      {userCondition === "admin" && (
        <>
          Control
          <ControlText>
            <Button onClick={() => router.push("/")}>{`Los geht's`}</Button>
          </ControlText>
          LLM
          <LLMText>
            <Button onClick={() => router.push("/")}>{`Los geht's`}</Button>
          </LLMText>
        </>
      )}

      {userCondition === "control" && (
        <ControlText>
          <Button onClick={() => router.push("/")}>{`Los geht's`}</Button>
        </ControlText>
      )}
      {(userCondition === "1" || userCondition === "2") && (
        <LLMText>
          <Button onClick={() => router.push("/")}>{`Los geht's`}</Button>
        </LLMText>
      )}
    </div>
  );
};

const LLMText = ({ children }: { children: React.ReactNode }) => (
  <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
    <h1 className="text-2xl font-bold">Willkommen. </h1>
    <p>
      Willkommen zu unserem Dankbarkeitsjournal.
      <br />
      Auf der folgenden Seite werden Ihnen einige Fragen zum Thema Dankbarkeit
      gestellt. Diese Fragen werden von einem System gestellt ung begleitet, das
      Ihnen zusätzliche Unterstützung bietet, um Ihre Gedanken und Gefühle
      strukturiert auszudrücken. Das System kann Vorschläge machen, um Ihnen zu
      helfen, den Einstieg zu erleichtern, oder Ihre Antworten vertiefen.
      <br /> <br />
      Es gibt keine richtigen oder falschen Antworten – wichtig ist, dass Sie
      ehrlich und in Ihrem eigenen Tempo antworten.
      <br /> <br />
      Wir empfehlen Ihnen, einen ruhigen Ort zu wählen, an dem Sie sich
      wohlfühlen und ungestört sind, um den Reflexionsprozess bestmöglich zu
      gestalten.
      <br /> <br />
      Viel Freude beim Reflektieren!
    </p>
    {children}
  </div>
);

const ControlText = ({ children }: { children: React.ReactNode }) => (
  <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
    <h1 className="text-2xl font-bold">Willkommen. </h1>
    <p>
      Willkommen zu unserem Dankbarkeitsjournal.
      <br />
      Auf der folgenden Seite werden Ihnen einige Fragen zum Thema Dankbarkeit
      gestellt. Sie werden diese Fragen eigenständig und ohne weitere
      Unterstützung beantworten. Nutzen Sie diesen Moment, um Ihre eigenen
      Gedanken und Gefühle frei zu formulieren.
      <br /> <br />
      Es gibt keine richtigen oder falschen Antworten – wichtig ist, dass Sie
      ehrlich und in Ihrem eigenen Tempo antworten.
      <br /> <br />
      Wir empfehlen Ihnen, einen ruhigen Ort zu wählen, an dem Sie sich
      wohlfühlen und ungestört sind, um den Reflexionsprozess bestmöglich zu
      gestalten.
      <br /> <br />
      Viel Freude beim Reflektieren!
    </p>
    {children}
  </div>
);
