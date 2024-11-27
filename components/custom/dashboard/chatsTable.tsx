"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Chat } from "@/db/schema";
import { Message } from "ai";

import { Download } from "lucide-react";
export default function ChatsTable({ chats }: { chats: Chat[] }) {
  const downloadUsers = () => {
    const data = {
      chats,
    };

    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.json";
    a.click();
  };

  const getTextFromMessages = (messages: Array<Message>) => {
    return messages
      .map((message) => message.role + ": " + message.content)
      .join("\\n");
  };

  console.log(chats);

  return (
    <div className="w-full border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
      <div className="grid grid-cols-2 gap-2">
        <h3>Chats</h3>
        <Button
          variant="outline"
          onClick={() => {
            downloadUsers();
          }}>
          <Download />
        </Button>
      </div>

      <ScrollArea className="max-h-[500px] w-full ">
        <Table>
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead className="w-[100px]">Messages</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {chats.map((chat) => (
              <TableRow key={chat.id}>
                <TableCell className="font-medium max-h-60 truncate max-w-60">
                  {getTextFromMessages(chat.messages)}
                </TableCell>
                <TableCell>{chat.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{chats.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
    </div>
  );
}
