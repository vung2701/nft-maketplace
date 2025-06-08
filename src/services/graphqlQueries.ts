import { gql } from '@apollo/client'

// ===================================
// 📊 MARKETPLACE ANALYTICS QUERIES
// ===================================

export const GET_MARKETPLACE_STATS = gql`
  query GetMarketplaceStats {
    marketplaceStat(id: "marketplace-stats") {
      totalVolume
      totalSales
      totalListings
      totalActiveListings
      averagePrice
      totalCollections
      totalUsers
      updatedAt
    }
  }
`

export const GET_DAILY_VOLUME = gql`
  query GetDailyVolume($days: Int!) {
    marketplaceDayDatas(first: $days, orderBy: date, orderDirection: desc) {
      date
      dailyVolume
      dailySales
      dailyListings
      dailyActiveUsers
      avgSalePrice
      volumeChange
      salesChange
    }
  }
`

export const GET_WEEKLY_VOLUME = gql`
  query GetWeeklyVolume($weeks: Int!) {
    marketplaceWeekDatas(first: $weeks, orderBy: week, orderDirection: desc) {
      week
      weeklyVolume
      weeklySales
      weeklyListings
      weeklyActiveUsers
      avgSalePrice
      volumeChange
      salesChange
    }
  }
`

// ===================================
// 🏆 COLLECTION ANALYTICS
// ===================================

export const GET_TOP_COLLECTIONS = gql`
  query GetTopCollections($limit: Int!) {
    collections(first: $limit, orderBy: totalVolume, orderDirection: desc) {
      id
      address
      totalVolume
      totalSales
      totalListings
      floorPrice
      ceilingPrice
      averagePrice
      lastSalePrice
    }
  }
`

export const GET_COLLECTION_DAILY_DATA = gql`
  query GetCollectionDailyData($collection: String!, $days: Int!) {
    collectionDayDatas(
      where: { collection: $collection }
      first: $days
      orderBy: date
      orderDirection: desc
    ) {
      date
      dailyVolume
      dailySales
      dailyListings
      openPrice
      closePrice
      highPrice
      lowPrice
      avgSalePrice
    }
  }
`

export const GET_COLLECTION_WEEKLY_DATA = gql`
  query GetCollectionWeeklyData($collection: String!, $weeks: Int!) {
    collectionWeekDatas(
      where: { collection: $collection }
      first: $weeks
      orderBy: week
      orderDirection: desc
    ) {
      week
      weeklyVolume
      weeklySales
      weeklyListings
      openPrice
      closePrice
      highPrice
      lowPrice
      avgSalePrice
      volumeChange
      priceChange
    }
  }
`

export const GET_COLLECTION_DETAILS = gql`
  query GetCollectionDetails($address: String!) {
    collection(id: $address) {
      id
      address
      totalVolume
      totalSales
      totalListings
      floorPrice
      ceilingPrice
      averagePrice
      lastSalePrice
    }
  }
`

// ===================================
// 👤 USER ANALYTICS
// ===================================

export const GET_USER_STATS = gql`
  query GetUserStats($address: String!) {
    user(id: $address) {
      id
      address
      totalListings
      totalPurchases
      totalSales
      totalVolumeAsBuyer
      totalVolumeAsSeller
      firstActivityAt
      lastActivityAt
    }
  }
`

export const GET_TOP_USERS = gql`
  query GetTopUsers($limit: Int!) {
    users(first: $limit, orderBy: totalVolumeAsBuyer, orderDirection: desc) {
      id
      address
      totalListings
      totalPurchases
      totalSales
      totalVolumeAsBuyer
      totalVolumeAsSeller
    }
  }
`

// ===================================
// 📋 TRADING QUERIES
// ===================================

export const GET_ACTIVE_LISTINGS = gql`
  query GetActiveListings($first: Int!, $skip: Int!) {
    listings(
      first: $first
      skip: $skip
      where: { isSold: false }
      orderBy: listedAt
      orderDirection: desc
    ) {
      id
      listingId
      seller {
        id
        address
        totalListings
        totalSales
      }
      nftAddress
      tokenId
      price
      listedAt
      transactionHash
    }
  }
`

export const GET_RECENT_SALES = gql`
  query GetRecentSales($limit: Int!) {
    purchases(first: $limit, orderBy: timestamp, orderDirection: desc) {
      id
      buyer {
        id
        address
      }
      seller {
        id
        address
      }
      nftAddress
      tokenId
      price
      timestamp
      transactionHash
    }
  }
`

export const GET_USER_LISTINGS = gql`
  query GetUserListings($seller: String!) {
    listings(
      where: { seller: $seller }
      orderBy: listedAt
      orderDirection: desc
    ) {
      id
      listingId
      nftAddress
      tokenId
      price
      isSold
      listedAt
      soldAt
      transactionHash
    }
  }
`

export const GET_USER_PURCHASES = gql`
  query GetUserPurchases($buyer: String!) {
    purchases(
      where: { buyer: $buyer }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      nftAddress
      tokenId
      price
      timestamp
      transactionHash
      seller {
        id
        address
      }
    }
  }
`

export const GET_USER_SALES = gql`
  query GetUserSales($seller: String!) {
    purchases(
      where: { seller: $seller }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      nftAddress
      tokenId
      price
      timestamp
      transactionHash
      buyer {
        id
        address
      }
    }
  }
`

// ===================================
// 🔍 ADVANCED ANALYTICS
// ===================================

export const GET_PRICE_OHLC = gql`
  query GetPriceOHLC($collection: String!, $days: Int!) {
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
      dailySales
      avgSalePrice
    }
  }
` 