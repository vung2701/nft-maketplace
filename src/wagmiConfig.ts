import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { Chain } from 'wagmi/chains';

// Định nghĩa mạng localhost
const localhost = {
  id: 31337,
  name: 'Hardhat',
  network: 'hardhat',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [localhost],
  transports: {
    [localhost.id]: http('http://127.0.0.1:8545'),
  },
});