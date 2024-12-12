import { motion } from "framer-motion";

export const JournalOverview = () => {
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
          Interventionen und Handlungsmustern eines Dankbarkeitstagebuches
          <code className="rounded-md bg-muted px-1 py-0.5">
            Gratitude Practice.
          </code>
        </p>
        <p>
          Nehmen Sie sich Zeit für sich und Ihre Gedanken. Versuchen sie die
          Fragen ausführlich zu beantworten und sich auf die positiven Dinge in
          Ihrem Leben zu konzentrieren.
        </p>
      </div>
    </motion.div>
  );
};
