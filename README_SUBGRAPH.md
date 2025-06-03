# NFT Marketplace - Subgraph Integration

## Tổng quan

Frontend đã được cập nhật để tích hợp với subgraph đơn giản, theo dõi các hoạt động cơ bản của NFT marketplace.

## Cấu trúc đã đơn giản hóa

### 📁 Components chính:
- **`TheGraphNFTList`**: Hiển thị danh sách NFT đang được bán
- **`MarketplaceStats`**: Thống kê tổng quan marketplace  
- **`PurchaseHistory`**: Lịch sử giao dịch mua bán

### 📊 Dữ liệu theo dõi:
- **Listings**: NFT được list để bán
- **Purchases**: Giao dịch mua bán đã hoàn thành
- **Marketplace Stats**: Thống kê tổng thể

### 🔧 Hooks & Services:
- `useActiveListings()`: Lấy NFT đang bán
- `usePurchaseHistory()`: Lấy lịch sử giao dịch
- `useMarketplaceStats()`: Lấy thống kê marketplace

## Cách sử dụng

### 1. Import component:
```tsx
import TheGraphNFTList from '../components/TheGraphNFTList';
import MarketplaceStats from '../components/MarketplaceStats';
import PurchaseHistory from '../components/PurchaseHistory';
```

### 2. Sử dụng trong JSX:
```tsx
function App() {
  return (
    <div>
      <MarketplaceStats />
      <TheGraphNFTList />
      <PurchaseHistory />
    </div>
  );
}
```

### 3. Cấu hình Subgraph URL:
Chỉnh sửa URL trong `src/services/graphqlClient.ts`:
```typescript
export const SUBGRAPH_URL = 'your-subgraph-url-here';
```

## GraphQL Queries

### Lấy NFT đang bán:
```graphql
query GetActiveListings($first: Int!, $skip: Int!) {
  listings(first: $first, skip: $skip, where: { isSold: false }) {
    id
    seller
    nftAddress
    tokenId
    price
    listedAt
    transactionHash
  }
}
```

### Lấy lịch sử giao dịch:
```graphql
query GetPurchaseHistory($first: Int!) {
  purchases(first: $first, orderBy: timestamp, orderDirection: desc) {
    id
    buyer
    seller
    nftAddress
    tokenId
    price
    timestamp
    transactionHash
  }
}
```

### Lấy thống kê:
```graphql
query GetMarketplaceStats {
  marketplaceStats(first: 1) {
    id
    totalListings
    totalSales
    totalVolume
    totalActiveListings
    averagePrice
    updatedAt
  }
}
```

## Error Handling

Tất cả components đều có xử lý lỗi graceful:
- Loading states với Spin component
- Error states với Alert component  
- Empty states với thông báo thân thiện

## Dependencies

Chắc chắn đã cài đặt:
```bash
npm install @tanstack/react-query graphql-request
```

## Lưu ý

- Subgraph URL cần phải được cập nhật đúng
- Dữ liệu được cache 1 phút (có thể điều chỉnh)
- Tự động retry 1 lần khi có lỗi
- Backward compatibility với hooks cũ 