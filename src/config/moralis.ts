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

	// IPFS Gateway configurations - prioritize Pinata
	ipfsGateways: [
		'https://gateway.pinata.cloud/ipfs/',
		'https://ipfs.moralis.io:2053/ipfs/',
		'https://ipfs.io/ipfs/',
		'https://cloudflare-ipfs.com/ipfs/',
		'https://dweb.link/ipfs/',
		'https://nftstorage.link/ipfs/'
	],

	// Pinata configuration
	pinata: {
		apiKey: import.meta.env.VITE_PINATA_API_KEY,
		apiSecret: import.meta.env.VITE_PINATA_API_SECRET,
		jwt: import.meta.env.VITE_PINATA_JWT,
		// Fix: API endpoint vs Gateway endpoint
		gateway: import.meta.env.VITE_PINATA_URL || 'https://gateway.pinata.cloud/ipfs/'
			
	}
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

// IPFS URL helper với multiple fallbacks
export const resolveIPFS = (url: string): string => {
	if (!url) return '';

	// Nếu đã là HTTP URL thì return nguyên
	if (url.startsWith('http')) return url;

	let hash = '';

	// Xử lý IPFS URLs
	if (url.startsWith('ipfs://')) {
		hash = url.replace('ipfs://', '');
	}
	// Nếu chỉ là hash
	else if (url.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}/) || url.match(/^ba[a-z2-7]{56}/)) {
		hash = url;
	}
	// Xử lý /ipfs/ paths
	else if (url.includes('/ipfs/')) {
		hash = url.split('/ipfs/')[1];
	}
	else {
		return url;
	}

	// Sử dụng Pinata gateway ưu tiên và đảm bảo format đúng
	const gateway = MORALIS_CONFIG.pinata.gateway || MORALIS_CONFIG.ipfsGateways[0];
	const cleanGateway = gateway.endsWith('/') ? gateway : gateway + '/';
	const finalUrl = `${cleanGateway}${hash}`;

	console.log('🔗 IPFS URL Resolution:', {
		original: url,
		hash,
		gateway: cleanGateway,
		final: finalUrl
	});

	return finalUrl;
};

// Helper để tạo multiple fallback URLs cho images
export const getIPFSFallbacks = (url: string): string[] => {
	if (!url || url.startsWith('http')) return [url];

	let hash = '';
	if (url.startsWith('ipfs://')) {
		hash = url.replace('ipfs://', '');
	} else if (url.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}/) || url.match(/^ba[a-z2-7]{56}/)) {
		hash = url;
	} else if (url.includes('/ipfs/')) {
		hash = url.split('/ipfs/')[1];
	} else {
		return [url];
	}

	// Tạo URLs và remove duplicates
	const urls = MORALIS_CONFIG.ipfsGateways.map(gateway => {
		const cleanGateway = gateway.endsWith('/') ? gateway : gateway + '/';
		return `${cleanGateway}${hash}`;
	});

	return [...new Set(urls)]; // Remove duplicates
}; 