import Moralis from 'moralis'

// Ensure global is available (fallback polyfill)
if (typeof (globalThis as any).global === 'undefined') {
	(globalThis as any).global = globalThis
}

// Chain ID mapping for Moralis
export const CHAIN_CONFIG = {
	polygon: '0x89',      // Polygon Mainnet
	eth: '0x1',           // Ethereum Mainnet
	ethereum: '0x1',      // Alias for Ethereum
	bsc: '0x38',          // Binance Smart Chain
	avalanche: '0xa86a'   // Avalanche C-Chain
} as const

// Reverse mapping for display
export const CHAIN_NAMES = {
	'0x89': 'Polygon',
	'0x1': 'Ethereum',
	'0x38': 'BSC',
	'0xa86a': 'Avalanche'
} as const

// Helper function to get chain ID
export const getChainId = (chainName: string): string => {
	const chainKey = chainName.toLowerCase() as keyof typeof CHAIN_CONFIG
	return CHAIN_CONFIG[chainKey] || CHAIN_CONFIG.polygon
}

// Helper function to get chain name
export const getChainName = (chainId: string): string => {
	return CHAIN_NAMES[chainId as keyof typeof CHAIN_NAMES] || 'Unknown'
}

// Moralis Configuration
export const MORALIS_CONFIG = {
	// TODO: Thay thế bằng API key thực tế từ https://admin.moralis.io/
	apiKey: (import.meta as any).env?.VITE_MORALIS_API_KEY || "",

	// Supported chains với chain IDs
	supportedChains: [
		{ name: 'Polygon', id: '0x89', key: 'polygon' },
		{ name: 'Ethereum', id: '0x1', key: 'eth' },
		{ name: 'BSC', id: '0x38', key: 'bsc' },
		{ name: 'Avalanche', id: '0xa86a', key: 'avalanche' }
	],

	// Default chain for queries
	defaultChain: '0x89' // Polygon chain ID
} as const

// Initialize Moralis (call once in app)
let isInitialized = false

export const initializeMoralis = async (): Promise<boolean> => {
	if (isInitialized) {
		console.log('✅ Moralis already initialized')
		return true
	}

	try {
		if (!MORALIS_CONFIG.apiKey) {
			console.warn('⚠️ Moralis API key not configured')
			return false
		}

		// Check if we're in a browser environment
		if (typeof window === 'undefined') {
			console.warn('⚠️ Moralis requires browser environment')
			return false
		}

		await Moralis.start({
			apiKey: MORALIS_CONFIG.apiKey,
		})

		isInitialized = true
		console.log('✅ Moralis initialized successfully')
		console.log('🔗 Supported chains:', MORALIS_CONFIG.supportedChains.map(c => `${c.name} (${c.id})`).join(', '))
		return true

	} catch (error) {
		console.error('❌ Failed to initialize Moralis:', error)

		// Specific error handling for common issues
		if (error instanceof Error) {
			if (error.message.includes('global')) {
				console.error('💡 Try refreshing the page - global polyfill issue')
			} else if (error.message.includes('crypto')) {
				console.error('💡 Crypto polyfill missing - check Vite config')
			} else if (error.message.includes('chain')) {
				console.error('💡 Invalid chain format - using chain IDs now')
			}
		}

		return false
	}
}

// Check if Moralis is ready
export const isMoralisReady = (): boolean => {
	return isInitialized && !!MORALIS_CONFIG.apiKey
}

// Get current configuration
export const getMoralisConfig = () => {
	return {
		...MORALIS_CONFIG,
		isInitialized,
		isReady: isMoralisReady(),
		hasGlobal: typeof (globalThis as any).global !== 'undefined',
		environment: typeof window !== 'undefined' ? 'browser' : 'node',
		chainHelpers: {
			getChainId,
			getChainName,
			availableChains: MORALIS_CONFIG.supportedChains
		}
	}
} 