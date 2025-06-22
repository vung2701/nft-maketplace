// ES6 Common utility functions for Chainlink components

// ES6 arrow functions với default parameters
export const formatAddress = (address) =>
	`${address.slice(0, 6)}...${address.slice(-4)}`;

export const formatNumber = (num, decimals = 4) =>
	parseFloat(num.toString()).toFixed(decimals);

export const formatTimestamp = (timestamp) =>
	new Date(parseInt(timestamp) * 1000).toLocaleString('vi-VN');

// ES6 template literals và default parameters
export const formatCurrency = (amount, symbol = 'ETH') =>
	`${formatNumber(amount)} ${symbol}`;

// ES6 conditional operator
export const truncateText = (text, maxLength = 50) =>
	text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

// Check if data is mock data
export const isMockData = (data) => {
	if (!data || data.length === 0) return false;

	// Check for mock addresses (starts with 0x123...)
	const firstItem = Array.isArray(data) ? data[0] : data;
	return firstItem?.user?.startsWith('0x123') ||
		firstItem?.nftAddress?.startsWith('0x123');
};

// ES6 Object shorthand và computed properties
export const RANK_CONFIGS = {
	1: { icon: 'CrownOutlined', color: '#FFD700' },
	2: { icon: 'TrophyOutlined', color: '#C0C0C0' },
	3: { icon: 'TrophyOutlined', color: '#CD7F32' },
	default: { icon: 'FireOutlined', color: '#1890ff' }
};

// ES6 const arrays
export const COMMON_TRAITS = [
	'Background', 'Body', 'Eyes', 'Mouth', 'Hat', 'Clothing', 'Accessories', 'Special'
];

// ES6 export default với object shorthand
export const chainlinkUtils = {
	formatAddress,
	formatNumber,
	formatTimestamp,
	formatCurrency,
	truncateText,
	isMockData,
	RANK_CONFIGS,
	COMMON_TRAITS
}; 