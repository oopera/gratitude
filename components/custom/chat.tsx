"use client";

import { Message } from "ai";
import { useChat } from "ai/react";

import { Message as PreviewMessage } from "@/components/custom/message";
import { useScrollToBottom } from "@/components/custom/use-scroll-to-bottom";

import { useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Journal } from "./journal";
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
  const [mode, setMode] = useState<"llm" | "llm-2" | "journal">("llm");

  const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
    useChat({
      body: { id },
      initialMessages,
      onFinish: () => {
        window.history.replaceState({}, "", `/chat/${id}`);
      },
    });

  const {
    currentQuestion,
    saveResponse,
    nextQuestion,
    prevQuestion,
    entries,
    currentQuestionIndex,
  } = useJournal();

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div className="flex flex-row justify-center pb-4 md:pb-8 h-dvh bg-background">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll">
          {messages.length === 0 && <Overview />}
          <RadioGroup
            defaultValue="llm"
            onValueChange={(value) => {
              setMode(value);
            }}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="llm" id="llm" />
              <Label htmlFor="llm">LLM</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="journal" id="journal" />
              <Label htmlFor="journal">Journal</Label>
            </div>
          </RadioGroup>

          {mode === "llm" && (
            <>
              {messages.map((message) => (
                <PreviewMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  attachments={message.experimental_attachments}
                  toolInvocations={message.toolInvocations}
                />
              ))}
            </>
          )}
          {mode === "journal" && (
            <>
              {entries.map((entry, index) => (
                <Journal
                  key={index}
                  role={entry.role}
                  content={entry.content}
                />
              ))}
            </>
          )}

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
            mode={mode}
          />
        </form>
      </div>
    </div>
  );
}
