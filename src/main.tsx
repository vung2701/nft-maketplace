import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloProvider } from '@apollo/client';
import { MoralisProvider } from './components/MoralisProvider';
import { config } from './wagmiConfig';
import { apolloClient } from './services/apolloClient';
import '@rainbow-me/rainbowkit/styles.css';
import './styles/global.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MoralisProvider>
      <ApolloProvider client={apolloClient}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider>
              <App />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ApolloProvider>
    </MoralisProvider>
  </React.StrictMode>
);
