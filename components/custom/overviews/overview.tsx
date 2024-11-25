import { motion } from "framer-motion";
import Link from "next/link";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="w-full md:max-w-[500px] mt-20 px-4 md:mx-0"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}>
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <p>
          Dies ist ein Dankbarkeitstagebuch der
          <code className="rounded-md bg-muted px-1 py-0.5">
            Hochschule Ruhr-West
          </code>
          im Masterstudium
          <code className="rounded-md bg-muted px-1 py-0.5">
            Mensch-Technik Interaktion.
          </code>
          Das Tagebuch ist ein Prototyp und dient der Erprobung von
          Interventionen und Handlungsmustern eines Chatbots im Rahmen der
          <code className="rounded-md bg-muted px-1 py-0.5">
            Gratitude Practice.
          </code>
        </p>
        <p>
          Der aktuelle Forschungsstand kann auf dem
          <Link
            className="text-blue-500 dark:text-blue-400"
            href="https://miro.com/app/board/uXjVLRDQ8Fo=/"
            target="_blank">
            {" "}
            Miroboard{" "}
          </Link>
          verfolgt werden.
        </p>
      </div>
    </motion.div>
  );
};
