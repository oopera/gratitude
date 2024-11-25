"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";

import { login, LoginActionState } from "../actions";

export default function Page() {
  const router = useRouter();

  const [name, setname] = useState("");

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid credentials!");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "success") {
      router.refresh();
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setname(formData.get("name") as string);
    formAction(formData);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Anmelden</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Benutze dein Kürzel und Passwort um dich anzumelden
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultname={name}>
          <SubmitButton>Anmelden</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Hast du keinen Account? "}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200">
              Registrieren
            </Link>
          </p>
        </AuthForm>
      </div>
    </div>
  );
}
