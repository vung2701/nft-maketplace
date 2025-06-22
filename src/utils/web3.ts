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



// Generate random rarity với ES6 arrow function
export const generateRandomRarity = () => {
	const randomScore = Math.floor(Math.random() * 10000) + 1;

	const rarityTier = Object.entries(RARITY_CONFIG).find(([_, config]) =>
		randomScore >= config.score[0] && randomScore <= config.score[1]
	)?.[0] || 'Common';

	const config = RARITY_CONFIG[rarityTier as keyof typeof RARITY_CONFIG];

	return {
		tier: rarityTier as keyof typeof RARITY_CONFIG,
		score: randomScore,
		percentage: config.percentage,
		color: config.color
	};
};



// Generate random attributes dựa trên rarity
export const generateRandomAttributes = (rarity: { tier: keyof typeof RARITY_CONFIG; score: number; percentage: number; color: string }) => {
	const baseAttributes = [
		{ trait_type: 'Background', values: ['Blue', 'Green', 'Red', 'Purple', 'Gold', 'Rainbow'] },
		{ trait_type: 'Eyes', values: ['Normal', 'Sleepy', 'Wink', 'Laser', 'Diamond', 'Fire'] },
		{ trait_type: 'Mouth', values: ['Smile', 'Frown', 'Surprise', 'Tongue', 'Grin', 'Silent'] },
		{ trait_type: 'Accessory', values: ['None', 'Hat', 'Glasses', 'Crown', 'Mask', 'Halo'] }
	];

	// Rare NFTs có nhiều attributes hơn
	const numAttributes = rarity.tier === 'Mythical' ? 4 :
		rarity.tier === 'Legendary' ? 3 :
			rarity.tier === 'Epic' ? 3 :
				rarity.tier === 'Rare' ? 2 : 2;

	return baseAttributes.slice(0, numAttributes).map(attr => ({
		trait_type: attr.trait_type,
		value: attr.values[Math.floor(Math.random() * attr.values.length)]
	}));
}; 