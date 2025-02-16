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
  chats,
  hasSecondCondition = false,
}: {
  chats: Chat[];
  hasSecondCondition?: boolean;
}) {
  const improveChatStructure = ({ chats }: { chats: Chat[] }) => {
    return chats
      .filter((chat) => chat.type != "admin")
      .map((chat) => {
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
            const improvedMessage = {
              role: message.role,
              text: Array.isArray(message.content)
                ? message.content?.[0].text
                : message.content,
            };
            return improvedMessage;
          });

        const amountOfWordsByUser = messages.reduce((result, message) => {
          if (!message) {
            return result;
          }
          if (message.role !== "user") {
            return result;
          }
          const words = message.text.split(" ");
          return result + words.length;
        }, 0);

        const cleanedAverageWords = messages
          .slice(2)
          .reduce((result, message) => {
            if (!message) {
              return result;
            }
            if (message.role !== "user") {
              return result;
            }
            const words = message.text.split(" ");
            return result + words.length;
          }, 0);

        return {
          user: chat.userName,
          createdAt: chat.createdAt,
          type: chat.type,
          condition: chat.condition,
          amountOfWordsByUser,
          cleanedAverageWords,
          messages: messages,
        };
      });
  };

  const cleanedChats = improveChatStructure({ chats });
  const journalChats = cleanedChats.filter(
    (chat) => chat.condition === "control"
  );

  const conditionOneChats = cleanedChats.filter(
    (chat) => chat.condition === "1"
  );
  const conditionTwoChats = cleanedChats.filter(
    (chat) => chat.condition === "2"
  );
  const assistantChats = cleanedChats.filter(
    (chat) => chat.condition !== "control"
  );

  const getAverageWordsPerChat = (chats: any[]) => {
    const totalWords = chats.reduce(
      (result, chat) => result + chat.amountOfWordsByUser,
      0
    );
    return totalWords / chats.length;
  };

  const getCleanedAverageWords = (chats: any[]) => {
    const totalWords = chats.reduce(
      (result, chat) => result + chat.cleanedAverageWords,
      0
    );
    return totalWords / chats.length;
  };

  const data = {
    assistantEntries: {
      averageWords: getAverageWordsPerChat(assistantChats),
      cleanedAverageWords: getCleanedAverageWords(assistantChats),
      chats: assistantChats,
    },
    journalEntries: {
      averageWords: getAverageWordsPerChat(journalChats),
      cleanedAverageWords: getCleanedAverageWords(journalChats),
      chats: journalChats,
    },
  };

  const downloadChats = () => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const currentDay = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    if (hasSecondCondition) {
      a.download = `long_chats_${currentDay}.json`;
    } else {
      a.download = `short_chats_${currentDay}.json`;
    }

    a.click();
  };

  const sortedData = [...journalChats, ...assistantChats];

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
        existingData.control += journalChats.filter(
          (c) => c.createdAt === chat.createdAt
        ).length;
      } else {
        result.push({
          date,
          1: conditionOneChats.filter((c) => c.createdAt === chat.createdAt)
            .length,
          2: conditionTwoChats.filter((c) => c.createdAt === chat.createdAt)
            .length,
          control: journalChats.filter((c) => c.createdAt === chat.createdAt)
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
        <h3>{hasSecondCondition ? "Week " : "Day "}Chats</h3>
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
          {hasSecondCondition && (
            <Bar dataKey="2" fill="var(--color-2)" radius={4} />
          )}
          <Bar dataKey="control" fill="var(--color-control)" radius={4} />
        </BarChart>
      </ChartContainer>
      Total : {sortedData.length} | LLM W:{" "}
      {getAverageWordsPerChat(assistantChats).toFixed(2)} | C W:{" "}
      {getAverageWordsPerChat(journalChats).toFixed(2)}
    </div>
  );
}
