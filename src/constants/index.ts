// Các routes trong ứng dụng
export const ROUTES = {
	HOME: '/',
	MARKETPLACE: '/marketplace',
	THE_GRAPH: '/the-graph',
	DASHBOARD: '/dashboard',
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
	LOAD_FAILED: 'Lỗi khi tải NFT: '
} as const;

// Các bước trong quá trình mint
export const MINT_STEPS = {
	UPLOAD_IMAGE: 'Đang upload ảnh lên IPFS...',
	UPLOAD_METADATA: 'Đang upload metadata lên IPFS...',
	MINTING: 'Đang mint NFT...',
	CONFIRMING: 'Đang đợi xác nhận giao dịch...'
} as const;

// Các giá trị mặc định
export const DEFAULT_VALUES = {
	IMAGE_HEIGHT: 240,
	CONTENT_MARGIN: 40,
	HEADER_HEIGHT: 64
} as const;

// Các màu sắc
export const COLORS = {
	PRIMARY: '#1890ff',
	SUCCESS: '#52c41a',
	ERROR: '#f5222d',
	BORDER: '#bbb'
} as const; 