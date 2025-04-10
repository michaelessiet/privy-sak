import "server-only";
import { PrivyClient } from "@privy-io/server-auth";

export const serverPrivyClient = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID as string,
  process.env.PRIVY_APP_SECRET as string,
);
