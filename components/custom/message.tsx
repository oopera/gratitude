"use client";

import { Attachment, ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";
import { Recollection } from "./recollection";

export const Message = ({
  role,
  content,
  toolInvocations,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}>
      <div className="size-[24px] flex flex-col justify-center items-center shrink-0 text-zinc-400">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content as string}</Markdown>
          </div>
        )}

        {toolInvocations && (
          <div className="flex flex-col gap-4">
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;
                return (
                  <div key={toolCallId}>
                    {toolName === "startNewEntry" ? (
                      <p>Ein neuer Eintrag wurde gestartet. </p>
                    ) : null}
                    {toolName === "recollect" ? (
                      <Recollection chats={result} />
                    ) : null}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName === "recollect" ? <Recollection /> : null}
                    {toolName === "startNewEntry" ? (
                      <p>Ein neuer Eintrag wird gestartet. </p>
                    ) : null}
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};
