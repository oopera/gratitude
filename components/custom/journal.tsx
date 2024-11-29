"use client";

import { Message } from "ai";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overviews/overview";
import useJournal from "./use-journal";

export function Journal({
  id,
  initialMessages,
  selectedModelId,
  userType,
  userCondition,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  userType: string;
  userCondition: string;
}) {
  const [input, setInput] = useState("");

  const { saveResponse, entries } = useJournal({
    userType,
    initialMessages,
    input,
    setInput,
    id,
    selectedModelId,
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center">
        <ScrollArea className="h-full w-dvw">
          <div
            ref={messagesContainerRef}
            className="flex flex-col h-full w-dvw items-center gap-4">
            {entries.length === 1 && userCondition === "admin" && (
              <>
                <Overview />
              </>
            )}

            <AnimatePresence>
              {entries.map((entry, index) => (
                <PreviewMessage
                  key={index}
                  index={index}
                  role={entry.role}
                  content={entry.content}
                />
              ))}
            </AnimatePresence>
            <div
              ref={messagesEndRef}
              className="shrink-0 min-w-[24px] min-h-[24px]"
            />
          </div>
        </ScrollArea>
        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={saveResponse}
            isLoading={false}
            stop={() => {}}
            messages={[{ role: "user", content: "placeholder", id }]}
            append={() => Promise.resolve(null)}
            selectedModelId={selectedModelId}
          />
        </form>
      </div>
    </div>
  );
}
