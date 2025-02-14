"use client";

export const CompleteOverview = () => {
  return (
    <div key="overview" className="w-full md:max-w-[500px] mt-20 px-4 md:mx-0">
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <h3 className="text-xl font-bold text-primary">Fertig!</h3>
        <p>
          Du hast diesen Studienteil erfolgreich abgeschlossen.
          <br />
          Du kannst dieses Browserfenster nun schließen und zur Umfrage
          zurückkehren.
        </p>
      </div>
    </div>
  );
};
