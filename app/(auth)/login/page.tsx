"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";

import { RegisterActionState, registerAndLogin } from "../actions";

function getUserTypeAndConditionFromDomain(hostname: string): {
  type: "admin" | "short" | "long" | "error";
  condition: "admin" | "1" | "2" | "control" | "error";
} {
  const DOMAIN_MAPPINGS = {
    gratitude: { type: "admin", condition: "admin" },
    localhost: { type: "admin", condition: "admin" },
    njgnw1sqaj: { type: "short", condition: "1" },
    "0qyv7gg42k": { type: "short", condition: "2" },
    f8cmbjr9vd: { type: "short", condition: "control" },
    k4rghr8a0v: { type: "long", condition: "1" },
    gr5hl0tis2: { type: "long", condition: "2" },
    aapz4cxm33: { type: "long", condition: "control" },
  } as const;

  const subdomain = hostname.split(".")[0];
  return (
    DOMAIN_MAPPINGS[subdomain as keyof typeof DOMAIN_MAPPINGS] ?? {
      type: "error",
      condition: "error",
    }
  );
}

export default function Page() {
  const router = useRouter();

  const [name, setname] = useState("");
  const [type, setType] = useState<"admin" | "short" | "long" | "error">(
    "error"
  );
  const [condition, setCondition] = useState<
    "admin" | "1" | "2" | "control" | "error"
  >("error");

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    registerAndLogin,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userTypeAndCondition = getUserTypeAndConditionFromDomain(
        window.location.hostname
      );
      setType(userTypeAndCondition.type);
      setCondition(userTypeAndCondition.condition);
    }
  }, []);

  useEffect(() => {
    console.log(state, "state");
    if (!state) {
      toast.error("Etwas ist schief gelaufen, bitte versuche es erneut.");
      router.refresh();
    } else if (state.status === "user_exists") {
      toast.error("Nutzer existiert bereits.");
    } else if (state.status === "failed") {
      toast.error("Etwas ist schief gelaufen, bitte versuche es erneut.");
    } else if (state.status === "invalid_data") {
      toast.error("Falsche Eingabe, bitte versuche es erneut.");
    } else if (state.status === "success_with_login") {
      router.refresh();
    } else if (state.status === "success") {
      toast.success("Nutzer erfolgreich erstellt.");
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setname(formData.get("name") as string);
    formData.append("type", type);
    formData.append("condition", condition);
    formAction(formData);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Anmelden</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Benutze dein Kürzel um dich anzumelden
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultname={name}>
          <SubmitButton>Anmelden</SubmitButton>
          {/* <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Hast du keinen Account? "}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200">
              Registrieren
            </Link>
          </p> */}
        </AuthForm>
      </div>
    </div>
  );
}
