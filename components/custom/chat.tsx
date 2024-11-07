"use client";

import { Message } from "ai";
import { useChat } from "ai/react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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
      label: "LLM (ChatGPT)",
      description: "Teile deine Dankbarkeit mit ChatGPT",
    },
    {
      value: "journal",
      label: "Journal (Tagebuch)",
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

  console.log(input);
  const onSubmit = mode === "journal" ? saveResponse : handleSubmit;

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll">
          {messages.length === 0 && entries.length === 1 && (
            <>
              <Overview />
              <RadioGroup
                className="flex max-w-[500px]"
                defaultValue="llm"
                onValueChange={(value: "journal" | "llm" | "llm-2") => {
                  setMode(value);
                }}>
                {modes.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.5 + 0.05 * index }}
                    key={item.value}
                    className="flex items-center space-x-2">
                    <RadioGroupItem value={item.value} id={item.value}>
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
                {messages.map((message) => (
                  <PreviewMessage
                    key={message.id}
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
