"use client";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto overflow-x-hidden pr-10">
        {users
          .sort((a, b) => {
            if (a.type === "admin") return -1;
            if (b.type === "admin") return 1;
            if (a.type === "control") return -1;
            if (b.type === "control") return 1;
            if (a.type === "condition_one") return -1;
            return 1;
          })
          .map((user) => (
            <div className="grid grid-cols-2 gap-2" key={user.id}>
              <p className="font-bold max-w-full truncate">{user.name}</p>
              <p>{user.type}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
