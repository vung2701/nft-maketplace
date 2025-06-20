/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_MORALIS_API_KEY?: string,
	readonly VITE_MARKETPLACE_SEPOLIA_ADDRESS?: string,
	readonly VITE_NFT_CONTRACT_SEPOLIA_ADDRESS?: string,
	readonly VITE_ACCOUNT_DEPLOY?: string,
	readonly VITE_MARKETPLACE_ADDRESS?: string,
	readonly VITE_NFT_CONTRACT_ADDRESS?: string,
	readonly VITE_WALLET_CONNECT_PROJECT_ID?: string,
	readonly VITE_BE_SEPOLIA_URL?: string,
	readonly VITE_PINATA_URL?: string,
	readonly VITE_PINATA_JWT?: string,
	readonly VITE_PINATA_API_SECRET?: string,
	readonly VITE_PINATA_API_KEY?: string,
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
