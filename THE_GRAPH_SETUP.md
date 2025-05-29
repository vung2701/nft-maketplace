# 🚀 Hướng dẫn chạy The Graph Integration

## ✅ Đã tích hợp vào dự án

The Graph đã được tích hợp hoàn toàn vào dự án NFT Marketplace của bạn với các tính năng:

### 📋 Components đã tạo:
- ✅ **Apollo Client** - GraphQL client setup
- ✅ **Custom Hooks** - useGraphQL hooks để query dữ liệu
- ✅ **TheGraphNFTList** - Component hiển thị danh sách NFT
- ✅ **MarketplaceStats** - Component thống kê marketplace
- ✅ **TheGraphDemo** - Trang demo tích hợp The Graph
- ✅ **Route /the-graph** - Menu và route mới

## 🏃‍♂️ Cách chạy ngay:

### 1. Chạy frontend:
```bash
cd frontend
npm run dev
```

### 2. Truy cập trang demo:
- Mở browser: `http://localhost:5173`
- Click menu **"The Graph Demo"**
- Xem các tab: NFT Marketplace, Thống kê, Tài liệu

## 🔧 Để tích hợp hoàn toàn:

### Bước 1: Deploy Subgraph
```bash
# Cài đặt Graph CLI
npm install -g @graphprotocol/graph-cli

# Tạo tài khoản The Graph Studio
# https://thegraph.com/studio/

# Tạo subgraph mới
graph init --studio nft-marketplace

# Copy code từ thư mục /subgraph vào project mới

# Deploy
graph auth --studio <YOUR_DEPLOY_KEY>
graph codegen
graph build
graph deploy --studio nft-marketplace
```

### Bước 2: Cập nhật URL Subgraph
Sửa file `frontend/src/services/apolloClient.ts`:
```typescript
const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/YOUR_SUBGRAPH_ID/nft-marketplace/v1.0.0'
```

### Bước 3: Smart Contract Events
Đảm bảo smart contract emit các events:
```solidity
event NFTMinted(uint256 tokenId, address creator, string tokenURI);
event NFTSold(uint256 tokenId, address seller, address buyer, uint256 price);
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
```

### Bước 4: Update Contract Address
Sửa file `subgraph/subgraph.yaml`:
```yaml
source:
  address: "0x5aA7f59160081692c8d7e3FC0f8dbD10EA7e2574" # Địa chỉ contract của bạn
  startBlock: 0 # Block number khi contract được deploy
```

## 🎯 Tính năng có sẵn:

### Query dữ liệu:
```typescript
import { useListedNFTs, useMarketplaceStats } from '../hooks/useGraphQL'

// Lấy NFT đang bán
const { loading, error, data } = useListedNFTs(12, 0)

// Thống kê marketplace
const { data: stats } = useMarketplaceStats()
```

### GraphQL Queries:
- `GET_ALL_NFTS` - Tất cả NFT
- `GET_LISTED_NFTS` - NFT đang bán
- `GET_USER_NFTS` - NFT của user
- `GET_NFT_DETAIL` - Chi tiết NFT
- `GET_SALES_HISTORY` - Lịch sử giao dịch
- `GET_MARKETPLACE_STATS` - Thống kê

### Utility Functions:
- `formatPrice()` - Convert wei sang ETH
- `formatAddress()` - Rút gọn địa chỉ
- `formatDate()` - Format timestamp

## 🔍 Kiểm tra:

1. **Frontend chạy:** `http://localhost:5173`
2. **Menu có "The Graph Demo"**
3. **Trang demo hiển thị thông báo về việc cần deploy subgraph**
4. **Components load mà không lỗi**

## 📁 Files đã tạo:

```
frontend/src/
├── services/
│   ├── apolloClient.ts       # Apollo Client setup
│   └── graphqlQueries.ts     # GraphQL queries
├── hooks/
│   └── useGraphQL.ts         # Custom hooks
├── components/
│   ├── TheGraphNFTList.tsx   # NFT list component
│   └── MarketplaceStats.tsx  # Stats component
├── pages/
│   └── TheGraphDemo.tsx      # Demo page
└── constants/
    └── index.ts              # Added THE_GRAPH route
```

## 🐛 Troubleshooting:

### Lỗi "Cannot find module '@apollo/client'":
```bash
cd frontend
npm install @apollo/client graphql
```

### Component không hiển thị dữ liệu:
- Kiểm tra URL subgraph trong `apolloClient.ts`
- Đảm bảo subgraph đã deploy thành công
- Kiểm tra smart contract có emit đúng events

### CORS Error:
- Thường do subgraph chưa deploy
- Hoặc URL subgraph không đúng

## 🎉 Kết quả:

Bây giờ bạn có:
- ✅ Trang demo The Graph hoạt động
- ✅ Components sẵn sàng để sử dụng
- ✅ GraphQL queries đã setup
- ✅ Real-time data khi subgraph được deploy
- ✅ Marketplace statistics
- ✅ Pagination cho NFT list

**Chạy `npm run dev` và truy cập `/the-graph` để xem demo!** 