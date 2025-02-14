import { motion } from "framer-motion";

export const Primer = () => {
  return (
    <motion.div
      key="primer"
      className="w-full md:max-w-[500px] mt-20 px-4 md:mx-0"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}>
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <p>
          Nehme Dir Zeit für Dich und Deine Gedanken. Versuche die Fragen
          ausführlich zu beantworten und dich auf die positiven Dinge in deinem
          Leben zu konzentrieren.
        </p>
      </div>
    </motion.div>
  );
};
