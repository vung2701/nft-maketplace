import { defineConfig } from 'vite';
import * as dotenv from 'dotenv';
dotenv.config();

import react from '@vitejs/plugin-react-swc';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
const config = defineConfig({
  server: { host: '0.0.0.0' },
  plugins: [
    react(),
  ],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  resolve: {
    alias: {
      // This is required for some dependencies
      stream: 'stream-browserify',
      crypto: 'crypto-browserify'
    }
  }
})

export default config;