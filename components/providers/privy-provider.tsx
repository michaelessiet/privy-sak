"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function NextPrivyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID as string}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          walletChainType: "solana-only",
          walletList: ["detected_solana_wallets"],
          // logo: "https://your-logo-url",
        },
        loginMethods: ["email", "wallet"],
        externalWallets: { walletConnect: { enabled: true } },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          solana: { createOnLogin: "users-without-wallets" },
          showWalletUIs: true,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
