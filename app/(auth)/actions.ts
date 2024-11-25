"use server";

import { z } from "zod";

import { createUser, getUser } from "@/db/queries";

import { signIn, signOut } from "./auth";

const authFormSchema = z.object({
  name: z.string(),
  password: z.string().min(6),
  type: z.string(),
});

const loginFormSchema = z.object({
  name: z.string(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
}

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = loginFormSchema.parse({
      name: formData.get("name"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      name: validatedData.name,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export const logout = async () => {
  await signOut({ redirect: false });
};

export const logoutComplete = async () => {
  await signOut({ redirectTo: "/complete" });
};

export interface RegisterActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
}

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      name: formData.get("name"),
      password: formData.get("password"),
      type: formData.get("type"),
    });

    let [user] = await getUser(validatedData.name);

    if (user) {
      return { status: "user_exists" } as RegisterActionState;
    } else {
      await createUser(
        validatedData.name,
        validatedData.password,
        validatedData.type
      );
      await signIn("credentials", {
        name: validatedData.name,
        password: validatedData.password,
        redirect: false,
      });

      return { status: "success" };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
