"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";

import { logoutComplete } from "@/app/(auth)/actions";
import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overviews/overview";

export function Chat({
  id,
  initialMessages,
  selectedModelId,
  userType,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
  userType: string;
}) {
  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: { id, selectedModelId },
      initialMessages,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
    });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const router = useRouter();

  useEffect(() => {
    const latestInitialMessage = initialMessages[initialMessages.length - 1];
    if (
      latestInitialMessage?.toolInvocations?.some(
        (tool) => tool.toolName === "completeEntry"
      )
    ) {
      return;
    }
    if (
      messages[messages.length - 1]?.toolInvocations?.some(
        (tool) => tool.toolName === "completeEntry"
      )
    ) {
      setTimeout(async () => {
        await logoutComplete();
      }, 1000);
    }
  }, [messages, router, initialMessages]);

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center">
        <div
          ref={messagesContainerRef}
          className="flex flex-col h-full w-dvw items-center gap-4 overflow-y-scroll">
          {messages.length === 0 && userType === "admin" && (
            <>
              <Overview />
            </>
          )}
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

        <form className="flex flex-row gap-2 relative items-end w-full md:max-w-[500px] max-w-[calc(100dvw-32px) px-4 md:px-0">
          <MultimodalInput
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
