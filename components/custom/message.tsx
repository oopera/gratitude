"use client";

import { ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import { BotIcon, NotebookIcon } from "lucide-react";
import { UserIcon } from "./icons";
import { Markdown } from "./markdown";

export const Message = ({
  index,
  role,
  content,
  toolInvocations,
}: {
  index: number;
  role: string;
  content: string | ReactNode;
  toolInvocations?: Array<ToolInvocation> | undefined;
}) => {
  const filteredToolInvocations = toolInvocations?.filter((toolInvocation) => {
    return toolInvocation.toolName === "eintragAbschliessen";
  });

  if (content === "" && !(filteredToolInvocations?.length ?? 0 > 0)) {
    return null;
  }

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 5, opacity: 0 }}
      transition={{ delay: 0.05 * index }}>
      <div className="size-[24px] flex flex-col justify-center items-center shrink-0 text-zinc-400">
        {role === "assistant" ? (
          <BotIcon />
        ) : role === "journal" ? (
          <NotebookIcon size={16} />
        ) : (
          <UserIcon />
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content as string}</Markdown>
          </div>
        )}

        {filteredToolInvocations && (
          <div className="flex flex-col gap-4">
            {filteredToolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;
              if (state === "result") {
                return (
                  <div key={toolCallId}>
                    {toolName === "eintragAbschliessen" ? (
                      <p>Der Chat wurde beendet. </p>
                    ) : null}
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName === "eintragAbschliessen" ? (
                      <p>Der Chat wird beendet.</p>
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
