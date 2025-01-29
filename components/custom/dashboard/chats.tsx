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
  const improveAssistantChatStructure = ({ chats }: { chats: Chat[] }) => {
    return chats.map((chat) => {
      const messages = chat.messages
        .filter((message) => {
          if (message.role === "tool") {
            return false;
          }

          if (Array.isArray(message.content)) {
            if (message.content.find((item) => item.type === "tool-call")) {
              return false;
            }
          }
          return true;
        })
        .map((message) => {
          if (message.role === "tool") {
            return;
          }

          if (Array.isArray(message.content)) {
            if (message.content.find((item) => item.type === "tool-call")) {
              return;
            }
          }

          const improvedMessage = {
            role: message.role,
            text: Array.isArray(message.content)
              ? message.content?.[0].text
              : message.content,
          };
          return improvedMessage;
        });
      return { user: chat.userName, type: chat.type, messages: messages };
    });
  };

  // console.log(improveAssistantChatStructure({ chats: controlChats }));

  const downloadChats = () => {
    const cleanedConditionOneChats = improveAssistantChatStructure({
      chats: conditionOneChats,
    });

    const cleanedControlChats = improveAssistantChatStructure({
      chats: controlChats,
    });

    const data = {
      conditionOneChats: cleanedConditionOneChats,
      controlChats: cleanedControlChats,
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

  const chartData = sortedData.reduce(
    (
      result: {
        date: string;
        1: number;
        2: number;
        control: number;
      }[],
      chat
    ) => {
      const date = chat.createdAt.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const existingData = result.find(
        (data: { date: string }) => data.date === date
      );

      if (existingData) {
        existingData[1] += conditionOneChats.filter(
          (c) => c.createdAt === chat.createdAt
        ).length;
        existingData[2] += conditionTwoChats.filter(
          (c) => c.createdAt === chat.createdAt
        ).length;
        existingData.control += controlChats.filter(
          (c) => c.createdAt === chat.createdAt
        ).length;
      } else {
        result.push({
          date,
          1: conditionOneChats.filter((c) => c.createdAt === chat.createdAt)
            .length,
          2: conditionTwoChats.filter((c) => c.createdAt === chat.createdAt)
            .length,
          control: controlChats.filter((c) => c.createdAt === chat.createdAt)
            .length,
        });
      }

      return result;
    },
    []
  );

  return (
    <div className="w-full border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700 h-fit">
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
                  return value;
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
