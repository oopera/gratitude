import Form from "next/form";
import Link from "next/link";

import { auth, signOut } from "@/app/(auth)/auth";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { History } from "./history";

import { ThemeToggle } from "./theme-toggle";

export const Navbar = async () => {
  let session = await auth();

  return (
    <>
      <div className="bg-background absolute top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center z-30">
        <div className="flex flex-row gap-3 items-center min-w-0">
          <History user={session?.user} />
          <Link href="/" className="flex flex-row gap-2 items-center min-w-0">
            <div className="text-sm dark:text-zinc-300 truncate">
              Dankbarkeitstagebuch
            </div>
          </Link>
        </div>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="py-1.5 px-2 h-fit font-normal"
                variant="secondary">
                {session.user?.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ThemeToggle />
              </DropdownMenuItem>
              <DropdownMenuItem className="p-1 z-50">
                <Form
                  className="w-full"
                  action={async () => {
                    "use server";

                    await signOut({
                      redirectTo: "/",
                    });
                  }}>
                  <button
                    type="submit"
                    className="w-full text-left px-1 py-0.5 text-red-500">
                    Ausloggen
                  </button>
                </Form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="py-1.5 px-2 h-fit font-normal" asChild>
            <Link href="/login">Einloggen</Link>
          </Button>
        )}
      </div>
    </>
  );
};
