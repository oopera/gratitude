"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import { initialQuestionPrompt } from "@/lib/ai/prompts";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { MultimodalInput } from "./multimodal-input";
import { Primer } from "./overviews/primer";
import useComplete from "./use-complete";

export function Chat({
  id,
  initialMessages = [
    {
      id: "jIhfWpb",
      role: "assistant",
      content: initialQuestionPrompt, //
      toolInvocations: [],
    },
  ],
  selectedModelId,
  userType,
}: {
  id: string;
  initialMessages?: Array<Message>;
  selectedModelId: string;
  userType: string;
  userCondition: string;
}) {
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: { id, selectedModelId },
      initialMessages,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
    });

  const [isFinished, setIsFinished] = useState(false);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  console.log(initialMessages, messages);
  const router = useRouter();

  useEffect(() => {
    if (
      messages.some((message) =>
        message.toolInvocations?.some(
          (tool) => tool.toolName === "eintragAbschliessen"
        )
      )
    ) {
      setIsFinished(true);
    }
  }, [messages, router, initialMessages, userType, id]);

  const { handleFinish } = useComplete({ userType });

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center">
        <ScrollArea className="h-full w-dvw">
          <div
            ref={messagesContainerRef}
            className="flex flex-col h-full w-dvw items-center gap-4">
            {messages.length === 1 && <Primer />}

            <AnimatePresence>
              {messages.map((message, index) => (
                <PreviewMessage
                  key={index}
                  index={index}
                  role={message.role}
                  content={message.content}
                  toolInvocations={message.toolInvocations}
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
            isFinished={isFinished}
            handleFinish={handleFinish}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            messages={messages}
            append={append}
            selectedModelId={selectedModelId}
          />
        </form>
      </div>
    </div>
  );
}
