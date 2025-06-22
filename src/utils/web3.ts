import type { NFTAttribute } from '../types/nft';

// Các hàm tiện ích cho web3
export const convertIpfsToHttp = (ipfsUrl: string): string => {
	if (!ipfsUrl) return '';
	return ipfsUrl.startsWith('ipfs://') ? ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/') : ipfsUrl;
};

// Fix URLs Pinata bị sai format
export const fixPinataUrl = (url: string): string => {
	if (!url) return '';

	// Nếu URL có format sai: https://api.pinata.cloud/QmXXX
	if (url.includes('api.pinata.cloud/') && !url.includes('/ipfs/')) {
		// Extract hash sau api.pinata.cloud/
		const parts = url.split('api.pinata.cloud/');
		if (parts.length === 2) {
			const hash = parts[1];
			// Convert sang format ipfs:// để hệ thống xử lý
			return `ipfs://${hash}`;
		}
	}

	return url;
};

export const shortenAddress = (address: string): string => {
	if (!address) return '';
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (wei: bigint): string => {
	return (Number(wei) / 1e18).toString();
};

// Parse Wei từ string sang số
export const parseWei = (weiString: string): number => {
	try {
		return parseFloat(weiString) / Math.pow(10, 18);
	} catch {
		return 0;
	}
};

// Rarity configuration với ES6 syntax
export const RARITY_CONFIG = {
	Common: { score: [1, 5000], percentage: 50, color: '#8c8c8c', multiplier: 1 },
	Uncommon: { score: [5001, 7500], percentage: 25, color: '#52c41a', multiplier: 1.2 },
	Rare: { score: [7501, 9000], percentage: 15, color: '#1890ff', multiplier: 1.5 },
	Epic: { score: [9001, 9750], percentage: 7.5, color: '#722ed1', multiplier: 2 },
	Legendary: { score: [9751, 9950], percentage: 2, color: '#fa8c16', multiplier: 3 },
	Mythical: { score: [9951, 10000], percentage: 0.5, color: '#f5222d', multiplier: 5 }
} as const;

// Utility functions cho Web3
export const formatAddress = (address: string): string => {
	if (!address) return '';
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTokenId = (tokenId: string | number): string => {
	return `#${tokenId}`;
};

export const formatPrice = (price: string | number, currency = 'ETH'): string => {
	const numPrice = typeof price === 'string' ? parseFloat(price) : price;
	return `${numPrice.toFixed(4)} ${currency}`;
};

export const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}...`;
};

export const isValidAddress = (address: string): boolean => {
	return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (err) {
		console.error('Copy to clipboard failed:', err);
		return false;
	}
};

export const getExplorerUrl = (address: string, chainId = 1): string => {
	const explorers = {
		1: 'https://etherscan.io',
		5: 'https://goerli.etherscan.io',
		137: 'https://polygonscan.com',
		80001: 'https://mumbai.polygonscan.com'
	};

	const baseUrl = explorers[chainId as keyof typeof explorers] || explorers[1];
	return `${baseUrl}/address/${address}`;
};

export const getTransactionUrl = (txHash: string, chainId = 1): string => {
	const explorers = {
		1: 'https://etherscan.io',
		5: 'https://goerli.etherscan.io',
		137: 'https://polygonscan.com',
		80001: 'https://mumbai.polygonscan.com'
	};

	const baseUrl = explorers[chainId as keyof typeof explorers] || explorers[1];
	return `${baseUrl}/tx/${txHash}`;
};

export const parseIPFSUrl = (url: string): string => {
	if (!url) return '';

	if (url.startsWith('ipfs://')) {
		return `https://ipfs.io/ipfs/${url.slice(7)}`;
	}

	if (url.includes('ipfs/')) {
		const hash = url.split('ipfs/')[1];
		return `https://ipfs.io/ipfs/${hash}`;
	}

	return url;
};

export const validateImageUrl = (url: string): boolean => {
	const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
	const lowerUrl = url.toLowerCase();

	return imageExtensions.some(ext => lowerUrl.includes(ext)) ||
		lowerUrl.includes('ipfs') ||
		lowerUrl.includes('data:image');
};

export const sleep = (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

export const debounce = <T extends (...args: any[]) => any>(
	func: T,
	wait: number
): ((...args: Parameters<T>) => void) => {
	let timeout: NodeJS.Timeout;

	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
};

export const throttle = <T extends (...args: any[]) => any>(
	func: T,
	limit: number
): ((...args: Parameters<T>) => void) => {
	let inThrottle: boolean;

	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => inThrottle = false, limit);
		}
	};
}; 