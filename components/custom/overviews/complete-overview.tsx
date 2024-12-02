export const CompleteOverview = () => {
  return (
    <div key="overview" className="w-full md:max-w-[500px] mt-20 px-4 md:mx-0">
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <h1 className="text-2xl font-bold">Abgeschlossen. </h1>
        <p>
          Sie haben diesen Studienteil erfolgreich abgeschlossen.
          <br />
          Sie können dieses Browserfenster nun schließen und zur Umfrage
          zurückkehren.
        </p>
      </div>
    </div>
  );
};
