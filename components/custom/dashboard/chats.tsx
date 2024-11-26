"use client";

import { Button } from "@/components/ui/button";
import { Chat } from "@/db/schema";
import { Download } from "lucide-react";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

  const sortedData = [
    ...conditionOneChats,
    ...conditionTwoChats,
    ...controlChats,
  ];

  sortedData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  console.log(sortedData, "sortedData");

  const chartData = sortedData.map((chat) => ({
    date: chat.createdAt.toISOString(),
    1: conditionOneChats.filter((c) => c.createdAt === chat.createdAt).length,
    2: conditionTwoChats.filter((c) => c.createdAt === chat.createdAt).length,
    control: controlChats.filter((c) => c.createdAt === chat.createdAt).length,
  }));

  console.log(chartData, "chartData");

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
      <ChartContainer config={chartConfig} className="max-h-full w-full">
        <BarChart data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                labelFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
            }
          />
          <Bar dataKey="1" fill="var(--color-1)" radius={4} />
          <Bar dataKey="2" fill="var(--color-2)" radius={4} />
          <Bar dataKey="control" fill="var(--color-control)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
