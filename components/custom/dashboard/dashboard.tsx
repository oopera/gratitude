"use client";

import { Chat, User } from "@/db/schema";
import Chats from "./chats";
import Codes from "./codes";
import Users from "./users";

export default function Dashboard({
  users,
  chats,
}: {
  users: User[];
  chats: {
    conditionOneChats: Chat[];
    conditionTwoChats: Chat[];
    controlChats: Chat[];
  };
}) {
  return (
    <div className="flex flex-col lg:grid w-full max-h-[400px] lg:grid-cols-3 gap-4 px-4 md:mx-0">
      <Chats
        conditionOneChats={chats.conditionOneChats as Chat[]}
        conditionTwoChats={chats.conditionTwoChats as Chat[]}
        controlChats={chats.controlChats as Chat[]}
      />
      <Codes users={users as User[]} />
      <Users users={users as User[]} />
    </div>
  );
}
