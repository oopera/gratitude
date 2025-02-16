"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { RegisterActionState, registerAndLogin } from "../actions";

function getUserTypeAndConditionFromDomain(hostname: string): {
  type: "admin" | "short" | "long" | "error";
  condition: "admin" | "1" | "2" | "control" | "error";
} {
  const random = Math.random();
  const DOMAIN_MAPPINGS = {
    gratitude: { type: "admin", condition: "admin" },
    localhost: { type: "admin", condition: "admin" },
    dankbarkeit: {
      type: "long",
      condition: random < 0.33 ? "1" : random < 0.66 ? "2" : "control",
    },
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
  const [showExplanation, setShowExplanation] = useState(false);

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
    if (!state) {
      toast.error("Etwas ist schief gelaufen, bitte versuche es erneut.");
      router.refresh();
    } else if (state.status === "user_exists") {
      toast.error("Nutzer existiert bereits.");
    } else if (state.status === "failed") {
      toast.error("Etwas ist schief gelaufen, bitte versuche es erneut.");
    } else if (state.status === "invalid_name_pw") {
      toast.error(
        "Dein Codewort sollte zwischen 8 und 10 Zeichen lang sein, und dein Passwort sollte mindestens 6 Zeichen lang sein."
      );
    } else if (state.status === "invalid_pw") {
      toast.error("Dein Passwort sollte mindestens 6 Zeichen lang sein.");
    } else if (state.status === "invalid_name") {
      toast.error("Dein Codewort sollte zwischen 8 und 10 Zeichen lang sein.");
    } else if (state.status === "success_with_login") {
      router.refresh();
    } else if (state.status === "success") {
      toast.success("Nutzer erfolgreich erstellt.");
      router.push("/einfuehrung");
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    setname(formData.get("name") as string);
    formData.append("type", type);
    formData.append("condition", condition);
    formAction(formData);
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center justify-start bg-background">
      <Image
        src="/images/logo.png"
        height={250}
        width={1500}
        alt="Logo"
        className="w-full max-w-[500px]"
      />
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-4 mt-20 ">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Anmelden</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Benutze dein Codewort aus der Studie und ein frei wählbares Passwort
            um dich anzumelden.
          </p>
        </div>
        <AuthForm action={handleSubmit} defaultname={name}>
          <div className="flex flex-col gap-2">
            <SubmitButton>Anmelden</SubmitButton>
            <Button
              type="button"
              className="w-full"
              variant={"link"}
              onClick={() => setShowExplanation(!showExplanation)}>
              Codewort Vergessen
            </Button>
            {showExplanation && (
              <>
                <p className="text-xs text-gray-500 dark:text-zinc-400 text-start">
                  So bildest du dein Codewort:
                  <br />
                </p>
                <ol className="list-decimal list-inside text-xs text-gray-500">
                  <li>
                    Der letzte Buchstabe Deines Geburtsortes (z.B. N für BERLIN)
                  </li>
                  <li>
                    Die zweite und letzte Zahl Deines Geburtsdatums (z.B. 77 für
                    07.08.1997)
                  </li>
                  <li>
                    Den ersten Buchstaben Deines Geburtsmonats (z.b A für
                    AUGUST)
                  </li>
                  <li>
                    Den ersten Buchstaben Deines Augenfarbe (z.B. G für GRAU)
                  </li>
                </ol>
                <p className="text-xs text-gray-500 dark:text-zinc-400 text-start">
                  Daraus ergibt sich folgender Beispiel-Code: N77AG
                </p>
              </>
            )}
          </div>
        </AuthForm>
      </div>
    </div>
  );
}
