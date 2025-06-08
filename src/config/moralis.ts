import Moralis from 'moralis';

// Moralis Configuration
export const MORALIS_CONFIG = {
	// API Key sẽ được lấy từ environment variables
	apiKey: import.meta.env.VITE_MORALIS_API_KEY,

	// Supported chains for NFT marketplace
	supportedChains: [
		1,      // Ethereum Mainnet
		137,    // Polygon
		56,     // BSC
		11155111 // Sepolia Testnet
	],

	// IPFS Gateway configurations
	ipfsGateways: [
		'https://ipfs.moralis.io:2053/ipfs/',
		'https://gateway.pinata.cloud/ipfs/',
		'https://ipfs.io/ipfs/',
		'https://cloudflare-ipfs.com/ipfs/'
	]
};

// Initialize Moralis - Global singleton
let initializationPromise: Promise<void> | null = null;
let isInitialized = false;

export const initializeMoralis = async (): Promise<void> => {
	// If already initialized, return immediately
	if (isInitialized) {
		return;
	}

	// If initialization is in progress, return the same promise
	if (initializationPromise) {
		return initializationPromise;
	}

	// Start initialization
	initializationPromise = (async () => {
		try {
			if (!MORALIS_CONFIG.apiKey) {
				throw new Error('VITE_MORALIS_API_KEY is required in environment variables');
			}

			console.log('🔄 Starting Moralis initialization...');

			await Moralis.start({
				apiKey: MORALIS_CONFIG.apiKey,
			});

			isInitialized = true;
			console.log('✅ Moralis initialized successfully');
		} catch (error: any) {
			// Reset promise on error so it can be retried
			initializationPromise = null;

			// Handle "already started" error gracefully
			if (error.message?.includes('Modules are started already') ||
				error.message?.includes('C0009') ||
				error.code === 'C0009') {
				console.log('✅ Moralis was already initialized');
				isInitialized = true;
				return;
			}

			console.error('❌ Failed to initialize Moralis:', error);
			throw error;
		}
	})();

	return initializationPromise;
};

// Helper function để check xem Moralis đã được khởi tạo chưa
export const isMoralisInitialized = (): boolean => {
	return isInitialized;
};

// Reset function for development/testing
export const resetMoralisInitialization = (): void => {
	isInitialized = false;
	initializationPromise = null;
};

// Chain helper functions
export const getChainName = (chainId: number): string => {
	const chainNames: Record<number, string> = {
		1: 'Ethereum',
		137: 'Polygon',
		56: 'BSC',
		11155111: 'Sepolia'
	};
	return chainNames[chainId] || `Chain ${chainId}`;
};

// IPFS URL helper
export const resolveIPFS = (url: string): string => {
	if (!url) return '';

	// Nếu đã là HTTP URL thì return nguyên
	if (url.startsWith('http')) return url;

	// Xử lý IPFS URLs
	if (url.startsWith('ipfs://')) {
		const hash = url.replace('ipfs://', '');
		return `${MORALIS_CONFIG.ipfsGateways[0]}${hash}`;
	}

	// Nếu chỉ là hash
	if (url.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/)) {
		return `${MORALIS_CONFIG.ipfsGateways[0]}${url}`;
	}

	return url;
}; 