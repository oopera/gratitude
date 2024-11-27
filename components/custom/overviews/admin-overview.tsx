export const AdminOverview = () => {
  return (
    <div key="overview" className="w-full mt-20 px-4 md:mx-0">
      <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
        <p>
          Das ist das Admindashboard für das Gratitude Practice Tagebuch. Hier
          können die Chatverläufe und Frequenz der Nutzung der Proband:innen
          verfolgt werden.
          <br />
          <br />
          <code className="rounded-md bg-muted px-1 py-0.5">
            Hochschule Ruhr-West
          </code>
          x
          <code className="rounded-md bg-muted px-1 py-0.5">
            M.sc. Mensch-Technik Interaktion.
          </code>
          x
          <code className="rounded-md bg-muted px-1 py-0.5">
            Gratitude Practice.
          </code>
        </p>
      </div>
    </div>
  );
};
