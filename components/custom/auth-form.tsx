import Form from "next/form";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AuthForm({
  action,
  children,
  defaultname = "",
}: {
  action: any;
  children: React.ReactNode;
  defaultname?: string;
}) {
  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="name"
          className="text-zinc-600 font-normal dark:text-zinc-400">
          Kürzel
        </Label>

        <Input
          id="name"
          name="name"
          className="bg-muted text-md md:text-sm"
          type="text"
          placeholder="Kürzel"
          autoComplete="name"
          required
          defaultValue={defaultname}
        />

        {/* <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400">
          Passwort
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
        /> */}
      </div>

      {children}
    </Form>
  );
}
