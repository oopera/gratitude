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
import { User } from "@/db/schema";

import { Download } from "lucide-react";
export default function Users({ users }: { users: User[] }) {
  const downloadUsers = () => {
    const data = {
      users,
    };

    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.json";
    a.click();
  };

  return (
    <div className="w-full border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
      <div className="grid grid-cols-2 gap-2">
        <h3>Users</h3>
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
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Condition</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users
              .sort((a, b) => {
                if (a.type === "admin" && b.type !== "admin") return -1;
                if (a.type !== "admin" && b.type === "admin") return 1;
                if (a.type === "long" && b.type !== "long") return -1;
                if (a.type !== "long" && b.type === "long") return 1;
                if (a.type === "short" && b.type !== "short") return -1;
                if (a.type !== "short" && b.type === "short") return 1;
                return 0;
              })
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>{user.condition}</TableCell>
                </TableRow>
              ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{users.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
    </div>
  );
}
