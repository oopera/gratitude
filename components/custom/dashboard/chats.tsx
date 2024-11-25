"use client";

import { Button } from "@/components/ui/button";
import { Chat } from "@/db/schema";
import { Download } from "lucide-react";

export default function Chats({
  conditionOneChats,
  conditionTwoChats,
  controlChats,
}: {
  conditionOneChats: Chat[];
  conditionTwoChats: Chat[];
  controlChats: Chat[];
}) {
  const downloadChats = () => {
    const data = {
      conditionOneChats,
      conditionTwoChats,
      controlChats,
    };

    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chats.json";
    a.click();
  };

  return (
    <div className="w-full border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
      <div className="grid grid-cols-2 gap-2">
        <h3>Chats</h3>
        <Button
          variant="outline"
          onClick={() => {
            downloadChats();
          }}>
          <Download />
        </Button>
      </div>
      <p>Condition One: {conditionOneChats.length}</p>
      <p>Condition Two: {conditionTwoChats.length}</p>
      <p>Control: {controlChats.length}</p>
    </div>
  );
}
