export const NoticeOverview = () => {
  return (
    <div key="overview" className="w-full md:max-w-[500px] mt-20 px-4 md:mx-0">
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <h1 className="text-xl font-bold text-primary">Danke,</h1>
        <p>
          Sie haben heute bereits einen Chat abgeschlossen.
          <br />
          Schauen Sie morgen wieder vorbei um einen weiteren Chat zu starten.
        </p>
      </div>
    </div>
  );
};
