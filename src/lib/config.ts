import { http, createConfig } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { mainnet, sepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
