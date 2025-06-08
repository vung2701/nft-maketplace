# NFT Marketplace Frontend

React app với analytics dashboard tích hợp **NFT Marketplace Analytics Subgraph**.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📊 Analytics Features

### Subgraph Integration
- **Volume Analytics**: Daily/Weekly volume tracking
- **Price History**: OHLC charts & trends  
- **Collection Rankings**: Top collections by volume
- **User Statistics**: Trading behavior analytics
- **Real-time Data**: Event-based updates

### Components
- `VolumeChart` - Daily/Weekly volume visualization
- `PriceHistoryChart` - Collection price trends
- `CollectionRankings` - Top performing collections
- `MarketplaceStats` - Key metrics dashboard
- `UserProfile` - Individual trading stats

## 🔧 Subgraph Setup

### 1. Update Subgraph URL
```typescript
// src/config/subgraph.ts
export const SUBGRAPH_URL = 'YOUR_DEPLOYED_SUBGRAPH_URL'
```

### 2. Available Queries
```typescript
// Volume analytics
useVolumeData(timeframe: 'daily' | 'weekly')

// Collection metrics  
useCollectionAnalytics(collectionAddress: string)

// Market overview
useMarketplaceStats()

// User trading data
useUserTradingStats(userAddress: string)
```

## 📈 Analytics Queries

### Daily Volume Trends
```graphql
query DailyVolume($days: Int!) {
  marketplaceDayDatas(first: $days, orderBy: date, orderDirection: desc) {
    date
    dailyVolume
    dailySales
    avgSalePrice
  }
}
```

### Collection Performance
```graphql
query TopCollections($limit: Int!) {
  collections(first: $limit, orderBy: totalVolume, orderDirection: desc) {
    id
    totalVolume
    totalSales
    floorPrice
    averagePrice
  }
}
```

### Price History (OHLC)
```graphql
query PriceHistory($collection: String!, $days: Int!) {
  collectionDayDatas(
    where: { collection: $collection }
    first: $days
    orderBy: date
    orderDirection: asc
  ) {
    date
    openPrice
    highPrice
    lowPrice
    closePrice
    dailyVolume
  }
}
```

## 🎯 Dashboard Pages

- `/analytics` - Volume & price analytics
- `/collections` - Collection rankings & stats
- `/users` - User leaderboards  
- `/marketplace` - Trading interface

## 🔗 Integration

Frontend connects to:
- **Subgraph**: Analytics data source
- **Wallet**: MetaMask/WalletConnect
- **Contract**: Direct blockchain interaction 