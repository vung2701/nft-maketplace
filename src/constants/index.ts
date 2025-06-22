// Các routes trong ứng dụng
export const ROUTES = {
	HOME: '/',
	MINT_NFT: '/mint-nft',
	MARKETPLACE: '/marketplace',
	THE_GRAPH: '/the-graph',
	DASHBOARD: '/dashboard',
	REWARDS: '/rewards',
	RARITY: '/rarity',
	PRICING: '/pricing',
} as const;

// Debug env variables
console.log('🔍 Environment Variables Debug:');
console.log('VITE_MARKETPLACE_ADDRESS:', import.meta.env.VITE_MARKETPLACE_ADDRESS);
console.log('VITE_AUTOMATED_REWARDS_ADDRESS:', import.meta.env.VITE_AUTOMATED_REWARDS_ADDRESS);
console.log('VITE_DYNAMIC_PRICING_ADDRESS:', import.meta.env.VITE_DYNAMIC_PRICING_ADDRESS);
console.log('VITE_RARITY_VERIFICATION_ADDRESS:', import.meta.env.VITE_RARITY_VERIFICATION_ADDRESS);

// Contract Addresses - với fallback values
export const CONTRACT_ADDRESSES = {
	MARKETPLACE: import.meta.env.VITE_MARKETPLACE_ADDRESS || '0x1234567890123456789012345678901234567890',
	NFT_COLLECTION: import.meta.env.VITE_NFT_COLLECTION_ADDRESS || '0x2345678901234567890123456789012345678901',
	DYNAMIC_PRICING: import.meta.env.VITE_DYNAMIC_PRICING_ADDRESS || '0x4567890123456789012345678901234567890123',
	AUTOMATED_REWARDS: import.meta.env.VITE_AUTOMATED_REWARDS_ADDRESS || '0x5678901234567890123456789012345678901234',
	RARITY_VERIFICATION: import.meta.env.VITE_RARITY_VERIFICATION_ADDRESS || '0x6789012345678901234567890123456789012345',
	REWARD_TOKEN: import.meta.env.VITE_REWARD_TOKEN_ADDRESS || '0x3456789012345678901234567890123456789012',
} as const;

// Log contract addresses
console.log('📦 Contract Addresses Loaded:');
Object.entries(CONTRACT_ADDRESSES).forEach(([key, value]) => {
	const isDefault = value?.startsWith('0x123') || value?.startsWith('0x234') ||
		value?.startsWith('0x345') || value?.startsWith('0x456') ||
		value?.startsWith('0x567') || value?.startsWith('0x678');
	console.log(`${key}:`, value, isDefault ? '(default/fallback)' : '(from env)');
});

// Các message thông báo
export const MESSAGES = {
	CONNECT_WALLET: 'Vui lòng kết nối ví!',
	UPLOAD_IMAGE: 'Vui lòng upload ảnh!',
	INVALID_PRICE: 'Giá không hợp lệ!',
	MINT_SUCCESS: 'Mint NFT thành công 🎉',
	MINT_FAILED: 'Mint thất bại: ',
	LIST_SUCCESS: 'Liệt kê NFT thành công 🎉',
	LIST_FAILED: 'Lỗi khi liệt kê NFT: ',
	BUY_SUCCESS: 'Mua NFT thành công 🎉',
	BUY_FAILED: 'Lỗi khi mua NFT: ',
	LOAD_FAILED: 'Lỗi khi tải NFT: ',
	RARITY_REQUEST_SUCCESS: 'Yêu cầu xác minh độ hiếm thành công 🎭',
	RARITY_REQUEST_FAILED: 'Lỗi khi yêu cầu xác minh độ hiếm: ',
	REWARDS_CLAIM_SUCCESS: 'Nhận rewards thành công 🎁',
	REWARDS_CLAIM_FAILED: 'Lỗi khi nhận rewards: ',
	FEE_PAYMENT_SUCCESS: 'Thanh toán phí thành công 💰',
	FEE_PAYMENT_FAILED: 'Lỗi khi thanh toán phí: ',
	PRICE_UPDATE_SUCCESS: 'Cập nhật giá thành công 📊',
	PRICE_UPDATE_FAILED: 'Lỗi khi cập nhật giá: ',
	ENV_NOT_FOUND: '⚠️ File .env không tìm thấy! Đang sử dụng giá trị mặc định.',
} as const;

// Các bước trong quá trình mint
export const MINT_STEPS = {
	UPLOAD_IMAGE: 'Đang upload ảnh lên IPFS...',
	UPLOAD_METADATA: 'Đang upload metadata lên IPFS...',
	MINTING: 'Đang mint NFT...',
	CONFIRMING: 'Đang đợi xác nhận giao dịch...',
	VERIFYING_RARITY: 'Đang xác minh độ hiếm...',
} as const;

// Các rarity tiers
export const RARITY_TIERS = {
	COMMON: { name: 'Common', color: '#8c8c8c', minScore: 0, maxScore: 4999 },
	UNCOMMON: { name: 'Uncommon', color: '#52c41a', minScore: 5000, maxScore: 7499 },
	RARE: { name: 'Rare', color: '#1890ff', minScore: 7500, maxScore: 8999 },
	EPIC: { name: 'Epic', color: '#722ed1', minScore: 9000, maxScore: 9899 },
	LEGENDARY: { name: 'Legendary', color: '#fa8c16', minScore: 9900, maxScore: 9999 },
} as const;

// Các giá trị mặc định
export const DEFAULT_VALUES = {
	IMAGE_HEIGHT: 240,
	CONTENT_MARGIN: 40,
	HEADER_HEIGHT: 150,
	REWARDS_INTERVAL: 7 * 24 * 60 * 60,
	FEE_PERCENTAGE: 2,
	TOP_USERS_COUNT: 5,
} as const;

// Các màu sắc
export const COLORS = {
	PRIMARY: '#1890ff',
	SUCCESS: '#52c41a',
	ERROR: '#f5222d',
	BORDER: '#bbb',
	WARNING: '#fa8c16',
	INFO: '#13c2c2',
} as const; 