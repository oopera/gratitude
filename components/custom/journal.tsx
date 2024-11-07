"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

import { InvoiceIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";

export const Journal = ({
  role,
  content,
}: {
  role: string;
  content: string | ReactNode;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 5, opacity: 0 }}>
      <div className="size-[24px] flex flex-col justify-center items-center shrink-0 text-zinc-400">
        {role === "journal" ? <InvoiceIcon size={16} /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-2 w-full">
        {content && (
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content as string}</Markdown>
          </div>
        )}
      </div>
    </motion.div>
  );
};
