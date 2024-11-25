"use client";
import { motion } from "framer-motion";

export const CompleteOverview = () => {
  return (
    <motion.div
      key="overview"
      className="w-full md:max-w-[500px] mt-20 px-4 md:mx-0"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}>
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <p>Abgeschlossen. </p>
        <p>
          Sie haben die Umfrage erfolgreich abgeschlossen.
          <br />
          Sie können nun in das Browserfenster der Umfrage zurückkehren.
        </p>
      </div>
    </motion.div>
  );
};
