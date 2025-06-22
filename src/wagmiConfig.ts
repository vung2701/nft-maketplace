import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { Chain, sepolia } from 'wagmi/chains';

// Định nghĩa mạng localhost
const localhost = {
  id: 31337,
  name: 'Hardhat',
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

const sepoliaRpcUrl = import.meta.env.VITE_BE_SEPOLIA_URL || 'https://rpc2.sepolia.org';

export const config = getDefaultConfig({
  appName: 'NFT Marketplace',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ?? (() => { throw new Error('VITE_WALLET_CONNECT_PROJECT_ID is not defined'); })(),
  chains: [localhost, sepolia],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
    [localhost.id]: http('http://127.0.0.1:8545'),
  },
});