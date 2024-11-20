"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { AnimatePresence } from "framer-motion";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import useJournal from "./use-Journal";

export function Chat({
  id,
  initialMessages,
  selectedModelId,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
}) {
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: { id },
      initialMessages,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
    });

  const { saveResponse, entries } = useJournal({ input, setInput, id });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const router = useRouter();

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (
      latestMessage?.toolInvocations?.some(
        (tool) => tool.toolName === "completeEntry"
      )
    ) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  }, [messages, router]);

  const onSubmit = selectedModelId === "control" ? saveResponse : handleSubmit;

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center">
        <div
          ref={messagesContainerRef}
          className="flex flex-col h-full w-dvw items-center gap-4 overflow-y-scroll">
          {messages.length === 0 && entries.length === 1 && (
            <>
              <Overview />
            </>
          )}
          <AnimatePresence>
            {selectedModelId !== "control" && (
              <>
                {messages.map((message, index) => (
                  <PreviewMessage
                    key={index}
                    index={index}
                    role={message.role}
                    content={message.content}
                    toolInvocations={message.toolInvocations}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {selectedModelId === "control" && (
              <>
                {entries.map((entry, index) => (
                  <PreviewMessage
                    key={index}
                    index={index}
                    role={entry.role}
                    content={entry.content}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={onSubmit}
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
