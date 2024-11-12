"use client";

import { Message } from "ai";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { AnimatePresence, motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { MultimodalInput } from "./multimodal-input";
import { Overview } from "./overview";
import useJournal from "./use-Journal";

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  const modes = [
    {
      value: "llm",
      label: "LLM",
      description: "Teile deine Dankbarkeit mit ChatGPT",
    },
    {
      value: "journal",
      label: "Journal",
      description: "Halte deine Dankbarkeit mit einem Tagebuch fest",
    },
  ];
  const [mode, setMode] = useState<"llm" | "llm-2" | "journal">("llm");

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

  const onSubmit = mode === "journal" ? saveResponse : handleSubmit;

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center">
        <div
          ref={messagesContainerRef}
          className="flex flex-col h-full w-dvw items-center gap-4 overflow-y-scroll">
          {messages.length === 0 && entries.length === 1 && (
            <>
              <Overview />
              <RadioGroup
                className="md:max-w-[500px] w-full px-4 md:mx-0 grid grid-cols-2"
                defaultValue="llm"
                onValueChange={(value: "journal" | "llm" | "llm-2") => {
                  setMode(value);
                }}>
                {modes.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    transition={{ delay: 0.05 * (index + 1) }}
                    key={item.value}
                    className="flex items-center space-x-2 h-full">
                    <RadioGroupItem
                      className="h-full"
                      value={item.value}
                      id={item.value}>
                      <span className="font-medium">{item.label}</span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {item.description}
                      </span>
                      {/* <Label htmlFor="journal">{item}</Label> */}
                    </RadioGroupItem>
                  </motion.div>
                ))}
              </RadioGroup>
            </>
          )}
          <AnimatePresence>
            {mode !== "journal" && (
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
            {mode === "journal" && (
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
            mode={mode}
          />
        </form>
      </div>
    </div>
  );
}
