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

// Contract Addresses - Deployed on Sepolia
export const CONTRACT_ADDRESSES = {
	MARKETPLACE: '0xde7AF7eF9A17dAf9E79d1D0feFfDe117b7EF25bB',
	NFT_COLLECTION: '0x080a6E8AFfD624f6A09FfBc931546e80F385b20F',
	DYNAMIC_PRICING: '0x8F6b3F68699Ef588F6eC2073B5640C4B3b6E06B1',
	AUTOMATED_REWARDS: '0x96095eA4Df213f9161a045D25eC93bEDF56d7302',
	RARITY_VERIFICATION: '0xaB740a41f0fD011f7632A567909f4EA839EfB786',
	REWARD_TOKEN: '0x9cABc4Bf65694A9d13Edf58410519b61B9D8C711',
} as const;

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