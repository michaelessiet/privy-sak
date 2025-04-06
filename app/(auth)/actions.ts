"use server";

import { z } from "zod";
import { createUser, getUser, updateUser } from "@/lib/db/queries";
import {} from "@vercel/blob";
import { signIn } from "./auth";
import { serverPrivyClient } from "@/lib/privy";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
}

export const login = async (
  _: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    const user = await getUser(validatedData.email);

    if (!user[0].walletId) {
      const { id } = await serverPrivyClient.walletApi.createWallet({
        chainType: "solana",
      });
      console.log(id);
      await updateUser(user[0].id, undefined, id);
    }

    return { status: "success" };
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
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
    | "invalid_data";
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: "user_exists" } as RegisterActionState;
    }
    const { id } = await serverPrivyClient.walletApi.createWallet({
      chainType: "solana",
    });
    await createUser(validatedData.email, validatedData.password, id);
    await signIn("credentials", {
      email: validatedData.email,
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
