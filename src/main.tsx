import React from "react";
import App from "./App.tsx";
import { config } from "@/lib/config";
import { WagmiProvider } from "wagmi";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import "./index.css";

const queryClient = new QueryClient();
const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider>
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
