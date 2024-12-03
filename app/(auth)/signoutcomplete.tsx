"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SignOutComplete() {
  useEffect(() => {
    signOut({ redirect: true, callbackUrl: "/abschluss" });
  }, []);

  return null;
}
