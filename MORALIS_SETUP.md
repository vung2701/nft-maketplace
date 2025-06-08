# 🚀 Hướng dẫn Setup Moralis cho NFT Marketplace

## 📋 Tổng quan
Moralis đã được tích hợp vào dự án để cung cấp:
- 🖼️ **NFT Metadata**: Name, description, image, attributes
- 📱 **Real-time Info**: Current ownership, balance updates  
- 📚 **Collection Data**: Contract metadata, owners
- 🔄 **IPFS Resolution**: Tự động resolve IPFS URLs
- 📈 **Transfer History**: Lịch sử giao dịch NFT

## 🔧 Cài đặt

### 1. Lấy Moralis API Key
1. Truy cập [Moralis Dashboard](https://admin.moralis.io/)
2. Tạo tài khoản hoặc đăng nhập
3. Tạo dApp mới
4. Copy API Key từ Settings

### 2. Cấu hình Environment Variables
Tạo file `.env.local` trong thư mục `frontend/`:

```bash
# Moralis Configuration
VITE_MORALIS_API_KEY=your_moralis_api_key_here
```

### 3. Sử dụng trong Component

```tsx
import React from 'react';
import { useAccount } from 'wagmi';
import { useUserNFTs, useNFTDetails } from '../hooks/useMoralis';

export const MyNFTComponent = () => {
  const { address } = useAccount();
  
  // Lấy NFTs của user
  const { data, isLoading, error } = useUserNFTs(address, 1); // Ethereum
  
  // Lấy chi tiết NFT cụ thể
  const nftDetails = useNFTDetails(
    '0x...', // token address
    '123',   // token id
    1        // chain id
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>My NFTs ({data?.nfts.length})</h2>
      {data?.nfts.map(nft => (
        <div key={`${nft.tokenAddress}-${nft.tokenId}`}>
          <img src={nft.image} alt={nft.name} />
          <h3>{nft.name}</h3>
          <p>{nft.description}</p>
          
          {/* Attributes */}
          {nft.attributes.map(attr => (
            <span key={attr.trait_type}>
              {attr.trait_type}: {attr.value}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
```

## 🎯 Available Hooks

### `useUserNFTs`
```tsx
const { data, isLoading, error, refetch } = useUserNFTs(
  address,     // wallet address
  chainId,     // 1 = Ethereum, 137 = Polygon, etc.
  {
    enabled: true,
    refetchInterval: 30000 // 30 seconds
  }
);
```

### `useNFTDetails`
```tsx
const { data, isLoading } = useNFTDetails(
  tokenAddress,
  tokenId,
  chainId
);
```

### `useCollectionMetadata`
```tsx
const { data } = useCollectionMetadata(tokenAddress, chainId);
```

### `useCollectionNFTs`
```tsx
const { data } = useCollectionNFTs(tokenAddress, chainId, {
  limit: 20
});
```

### `useNFTTransfers`
```tsx
const { data } = useNFTTransfers(tokenAddress, tokenId, chainId, {
  limit: 10
});
```

### `useResyncNFTMetadata`
```tsx
const resync = useResyncNFTMetadata();

// Resync metadata
resync.mutate({
  tokenAddress: '0x...',
  tokenId: '123',
  chainId: 1
});
```

## 🌐 Supported Chains

| Chain ID | Network | Description |
|----------|---------|-------------|
| 1        | Ethereum Mainnet | Main Ethereum network |
| 137      | Polygon | Polygon PoS |
| 56       | BSC     | Binance Smart Chain |
| 11155111 | Sepolia | Ethereum testnet |

## 🔄 Real-time Features

### Auto-refresh Data
```tsx
const { refreshData } = useRefreshNFTData();

// Refresh user NFTs
refreshData.refreshUserNFTs(address, chainId);

// Refresh NFT details
refreshData.refreshNFTDetails(tokenAddress, tokenId, chainId);

// Refresh collection data
refreshData.refreshCollectionData(tokenAddress, chainId);
```

### All-in-one Hook
```tsx
const {
  nfts,
  isLoading,
  error,
  refetch,
  refreshData,
  resyncMetadata,
  isResyncing
} = useNFTMarketplace(address, chainId);
```

## 📊 Data Structure

### ProcessedNFT
```typescript
interface ProcessedNFT {
  // Basic info
  tokenAddress: string;
  tokenId: string;
  owner: string;
  
  // Metadata
  name: string;
  description: string;
  image: string;            // Auto-resolved IPFS
  externalUrl?: string;
  animationUrl?: string;    // Auto-resolved IPFS
  
  // Attributes
  attributes: NFTAttribute[];
  
  // Collection info
  collectionName: string;
  collectionSymbol: string;
  collectionLogo?: string;
  
  // Status
  isSpam: boolean;
  isVerified: boolean;
  
  // Blockchain info
  chainId: number;
  blockNumber: string;
  minterAddress: string;
  lastSync: string;
}
```

### NFTAttribute
```typescript
interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: 'boost_number' | 'boost_percentage' | 'number' | 'date';
  max_value?: number;
}
```

## 💡 Best Practices

### 1. Error Handling
```tsx
const { data, error, refetch } = useUserNFTs(address);

if (error) {
  return (
    <Alert 
      message="Error loading NFTs"
      description={error.message}
      action={<Button onClick={() => refetch()}>Retry</Button>}
    />
  );
}
```

### 2. Loading States
```tsx
if (isLoading) {
  return <Spin size="large" />;
}
```

### 3. Caching
React Query tự động cache data với các thời gian khác nhau:
- User NFTs: 5 phút
- NFT Details: 10 phút  
- Collection Metadata: 15 phút
- Transfer History: 2 phút

### 4. Pagination
```tsx
const { data, fetchNextPage, hasNextPage } = useUserNFTs(address);

// Load more NFTs
if (hasNextPage) {
  fetchNextPage();
}
```

## 🐛 Troubleshooting

### 1. API Key Issues
- Kiểm tra `VITE_MORALIS_API_KEY` trong `.env.local`
- Đảm bảo API key đúng từ Moralis Dashboard
- Restart dev server sau khi thay đổi env vars

### 2. CORS Issues
- Moralis API được config để hoạt động với frontend
- Nếu có lỗi CORS, check domain whitelist trong Moralis Dashboard

### 3. Network Issues
- Kiểm tra chain ID có trong `supportedChains`
- Ethereum Mainnet có thể chậm, thử Polygon (137) để test

### 4. IPFS Images Not Loading
- Service tự động fallback qua nhiều IPFS gateways
- Check network connection
- Một số NFTs có thể có metadata lỗi

## 📖 Example Usage

Xem file `src/components/MoralisNFTDemo.tsx` để có ví dụ hoàn chỉnh về cách sử dụng tất cả features.

## 🔗 Links

- [Moralis Documentation](https://docs.moralis.io/)
- [Moralis Dashboard](https://admin.moralis.io/)
- [React Query Documentation](https://tanstack.com/query/latest) 