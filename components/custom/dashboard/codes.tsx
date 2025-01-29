"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { User } from "next-auth";

export default function Codes({ users }: { users: User[] }) {
  const downloadCodes = () => {
    const json = JSON.stringify(
      users.map((item) => {
        return item.name;
      })
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codes.json";
    a.click();
  };

  return (
    <div className="w-full border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700 h-fit">
      <div className="grid grid-cols-2 gap-2">
        <h3>Codes</h3>
        <Button
          variant="outline"
          onClick={() => {
            downloadCodes();
          }}>
          <Download />
        </Button>
      </div>
    </div>
  );
}
