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
      {userCondition === "1" && (
        <LLMText>
          <Button onClick={() => router.push("/")}>{`Los geht's`}</Button>
        </LLMText>
      )}

      {userCondition === "2" && (
        <LLMMemoryText>
          <Button onClick={() => router.push("/")}>{`Los geht's`}</Button>
        </LLMMemoryText>
      )}
    </div>
  );
};

const LLMMemoryText = ({ children }: { children: React.ReactNode }) => (
  <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
    <p>
      Willkommen zu unserem KI-unterstützten Dankbarkeitsjournal mit
      Erinnerungsfunktion.
      <br />
      Auf der folgenden Seite werden dir einige Fragen zum Thema Dankbarkeit
      gestellt. Diese Fragen werden von einem System gestellt und begleitet, das
      dir zusätzliche Unterstützung bietet, um deine Gedanken und Gefühle
      strukturiert auszudrücken.
      <br />
      Das System kann sich an deine vergangenen Einträge erinnern. Es kann dir
      auch helfen, den Einstieg zu erleichtern oder deine Antworten zu
      vertiefen. Wenn du dem System dein Namen nennst, kann es dich persönlich
      ansprechen.
      <br />
      Wir empfehlen dir, einen ruhigen Ort zu wählen, an dem du dich wohlfühlst
      und ungestört ist, um den Reflexionsprozess bestmöglich zu gestalten.
      <br /> <br />
      Viel Freude beim Reflektieren!
    </p>
    {children}
  </div>
);

const LLMText = ({ children }: { children: React.ReactNode }) => (
  <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
    <p>
      Willkommen zu unserem KI-unterstützten Dankbarkeitsjournal.
      <br />
      Auf der folgenden Seite werden dir einige Fragen zum Thema Dankbarkeit
      gestellt. Diese Fragen werden von einem System gestellt und begleitet, das
      dir zusätzliche Unterstützung bietet, um deine Gedanken und Gefühle
      strukturiert auszudrücken. Das System kann Vorschläge machen, um dir zu
      helfen, den Einstieg zu erleichtern oder deine Antworten zu vertiefen.
      <br />
      Wir empfehlen dir, einen ruhigen Ort zu wählen, an dem du dich wohlfühlst
      und ungestört ist, um den Reflexionsprozess bestmöglich zu gestalten.
      <br /> <br />
      Viel Freude beim Reflektieren!
    </p>
    {children}
  </div>
);

const ControlText = ({ children }: { children: React.ReactNode }) => (
  <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
    <p>
      Willkommen zu unserem Dankbarkeitsjournal.
      <br />
      Auf der folgenden Seite werden Dir einige Fragen zum Thema Dankbarkeit
      gestellt. Wir bitten Dich diese Fragen eigenständig und ohne weitere
      Unterstützung zu beantworten. Nutze diesen Moment, um Deine eigenen
      Gedanken und Gefühle frei zu formulieren.
      <br />
      Wir empfehlen dir, einen ruhigen Ort zu wählen, an dem du dich wohlfühlst
      und ungestört ist, um den Reflexionsprozess bestmöglich zu gestalten.
      <br /> <br />
      Viel Freude beim Reflektieren!
    </p>
    {children}
  </div>
);
