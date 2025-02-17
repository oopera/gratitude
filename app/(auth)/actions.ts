"use server";

import { z } from "zod";

import { createUser, getUser } from "@/db/queries";

import { signIn, signOut } from "./auth";

const authFormSchema = z.object({
  name: z.string().min(4),
  condition: z.string(),
  password: z.string().min(6),
  type: z.string(),
});

const loginFormSchema = z.object({
  name: z.string(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_data"
    | "invalid_name_pw"
    | "invalid_name"
    | "invalid_pw";
}

export const logout = async () => {
  await signOut({ redirect: false });
};

export const logoutComplete = async () => {
  await signOut({ redirectTo: "/abschluss" });
};

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
      const fields = error.errors.map((err) => err.path.join("."));
      if (fields.includes("name") && fields.includes("password")) {
        return { status: "invalid_name_pw" };
      }
      if (fields.includes("name")) {
        return { status: "invalid_name" };
      }
      if (fields.includes("password")) {
        return { status: "invalid_pw" };
      }
    }

    return { status: "failed" };
  }
};

export interface RegisterActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "success_with_login"
    | "invalid_data"
    | "invalid_name_pw"
    | "invalid_name"
    | "invalid_pw"
    | "wrong_pw";
}

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      name: formData.get("name"),
      condition: formData.get("condition"),
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
        validatedData.type,
        validatedData.condition
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

export const registerAndLogin = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      name: formData.get("name"),
      type: formData.get("type"),
      condition: formData.get("condition"),
      password: formData.get("password"),
    });

    let [user] = await getUser(validatedData.name);

    if (user) {
      await signIn("credentials", {
        name: validatedData.name,
        password: validatedData.password,
        redirect: false,
      });
      return { status: "success_with_login" };
    } else {
      await createUser(
        validatedData.name,
        validatedData.type,
        validatedData.condition,
        validatedData.password
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
      const fields = error.errors.map((err) => err.path.join("."));
      if (fields.includes("name") && fields.includes("password")) {
        return { status: "invalid_name_pw" };
      }
      if (fields.includes("name")) {
        return { status: "invalid_name" };
      }
      if (fields.includes("password")) {
        return { status: "invalid_pw" };
      }
    }
    if ((error as any)?.code === "credentials") {
      return { status: "wrong_pw" };
    }
    return { status: "failed" };
  }
};
