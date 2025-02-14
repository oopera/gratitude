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
    {/* <h1 className="text-xl font-bold">Willkommen! </h1> */}
    <p>
      Willkommen zu unserem KI-unterstütztem Dankbarkeitsjournal.
      <br />
      Auf der folgenden Seite werden Dir einige Fragen zum Thema Dankbarkeit
      gestellt. Diese Fragen werden von einem System gestellt und begleitet, das
      Dir zusätzliche Unterstützung bietet, um Ihre Gedanken und Gefühle
      strukturiert auszudrücken. Das System kann Vorschläge machen, um Dir zu
      helfen, den Einstieg zu erleichtern, oder Ihre Antworten vertiefen.
      <br />
      Wir empfehlen Dir, einen ruhigen Ort zu wählen, an dem Du dich wohlfühlst
      und ungestört ist, um den Reflexionsprozess bestmöglich zu gestalten.
      <br /> <br />
      Viel Freude beim Reflektieren!
    </p>
    {children}
  </div>
);

const ControlText = ({ children }: { children: React.ReactNode }) => (
  <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
    {/* <h1 className="text-xl font-bold">Willkommen! </h1> */}
    <p>
      Willkommen zu unserem Dankbarkeitsjournal.
      <br />
      Auf der folgenden Seite werden Dir einige Fragen zum Thema Dankbarkeit
      gestellt. Wir bitten Dich diese Fragen eigenständig und ohne weitere
      Unterstützung zu beantworten. Nutze diesen Moment, um Deine eigenen
      Gedanken und Gefühle frei zu formulieren.
      <br />
      Wir empfehlen Dir, einen ruhigen Ort zu wählen, an dem Du dich wohlfühlst
      und ungestört ist, um den Reflexionsprozess bestmöglich zu gestalten.
      <br /> <br />
      Viel Freude beim Reflektieren!
    </p>
    {children}
  </div>
);
