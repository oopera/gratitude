"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";

import { register, RegisterActionState } from "../actions";

function getUserTypeFromSubdomain(
  hostname: string
): "admin" | "control" | "c_1" | "c_2" {
  const subdomain = hostname.split(".")[0];

  switch (subdomain) {
    case "gratitude":
      return "admin";
    case "grhrwc01":
      return "c_1";
    case "grhrwc02":
      return "c_2";
    case "grhrwc03":
      return "control";
    case "localhost":
      return "admin";
    default:
      return "control"; // Default fallback
  }
}

export default function Page() {
  const router = useRouter();

  const [name, setname] = useState("");
  const [type, setType] = useState<"admin" | "control" | "c_1" | "c_2">(
    "control"
  );
  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userType = getUserTypeFromSubdomain(window.location.hostname);
      setType(userType);
    }
  }, []);

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error("Account already exists");
    } else if (state.status === "failed") {
      toast.error("Failed to create account");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "success") {
      toast.success("Account created successfully");
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setname(formData.get("name") as string);
    formData.append("type", type);
    formAction(formData);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">
            Registrieren
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Erstelle einen Account mit deinem namen und Passwort
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultname={name}>
          <SubmitButton>Registrieren</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Hast du bereits einen Account? "}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200">
              Anmelden
            </Link>
          </p>
        </AuthForm>
      </div>
    </div>
  );
}
