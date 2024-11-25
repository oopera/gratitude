"use client";

import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ArrowUpIcon, StopIcon } from "./icons";
import useWindowSize from "./use-window-size";

const startAction = {
  title: "Eintrag beginnen",
  label: "Was war heute schön?",
  action:
    "Ich möchte einen Dankbarkeitstagebuch Eintrag beginnen. Bitte gib mir die erste Frage des Tages.",
};
const recollectAction = {
  title: "Vergangene Einträge",
  label: "Was habe ich zuletzt geschrieben?",
  action: "Rekapituliere meine letzten Einträge.",
};

export const suggestedActions: Record<string, Array<typeof startAction>> = {
  condition_one: [startAction],
  condition_two: [startAction],
  condition_three: [startAction, recollectAction],
  admin: [startAction, recollectAction],
};

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  messages,
  append,
  handleSubmit,
  selectedModelId,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Array<Message>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void;
  selectedModelId: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
    adjustHeight();
  };

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {});

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [handleSubmit, width]);

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && (
        <div className="grid sm:grid-cols-2 gap-2 w-full md:px-0 mx-auto md:max-w-[500px]">
          <AnimatePresence>
            {selectedModelId !== "control" && (
              <>
                {suggestedActions[selectedModelId].map(
                  (suggestedAction, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.98 }}
                      transition={{ delay: 0.1 + 0.05 * index }}
                      key={index}
                      className={index > 1 ? "hidden sm:block" : "block"}>
                      <button
                        onClick={async () => {
                          append({
                            role: "user",
                            content: suggestedAction.action,
                          });
                        }}
                        className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col">
                        <span className="font-medium">
                          {suggestedAction.title}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400">
                          {suggestedAction.label}
                        </span>
                      </button>
                    </motion.div>
                  )
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      )}
      <Textarea
        disabled={messages.length === 0}
        ref={textareaRef}
        placeholder="Verfasse eine Antwort..."
        value={input}
        onChange={handleInput}
        className="min-h-[24px] overflow-hidden resize-none rounded-lg text-base bg-muted"
        rows={3}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (isLoading) {
              toast.error("Please wait for the model to finish its response!");
            } else {
              submitForm();
            }
          }
        }}
      />
      {isLoading ? (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5"
          onClick={(event) => {
            event.preventDefault();
            stop();
          }}>
          <StopIcon size={14} />
        </Button>
      ) : (
        <Button
          className="rounded-full p-1.5 h-fit absolute bottom-2 right-2 m-0.5"
          onClick={(event) => {
            event.preventDefault();
            submitForm();
          }}
          disabled={input.length === 0}>
          <ArrowUpIcon size={14} />
        </Button>
      )}
    </div>
  );
}
