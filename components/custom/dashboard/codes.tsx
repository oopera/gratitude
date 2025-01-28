"use client";

import { Button } from "@/components/ui/button";
import { Chat } from "@/db/schema";
import { Download } from "lucide-react";

import { type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  amount: {
    label: "Anzahl",
  },
  1: {
    label: "Kondition 1",
    color: "#2563eb",
  },
  2: {
    label: "Kondition 2",
    color: "#60a5fa",
  },
  control: {
    label: "Kontrolle",
    color: "#64748b",
  },
} satisfies ChartConfig;

export default function Codes({
  conditionOneChats,
  controlChats,
}: {
  conditionOneChats: Chat[];
  controlChats: Chat[];
}) {
  const sortedData = [...conditionOneChats, ...controlChats];

  sortedData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const downloadCodes = () => {
    const data = {
      conditionOneChats,
      controlChats,
    };

    const json = JSON.stringify(
      sortedData
        .map((item) => {
          return item.userName;
        })
        .toString()
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chats.json";
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
