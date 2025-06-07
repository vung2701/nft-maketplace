import { gql } from '@apollo/client'

// ===================================
// 📋 LISTING QUERIES
// ===================================

// Lấy tất cả listings với thông tin đầy đủ
export const GET_ALL_LISTINGS = gql`
  query GetAllListings($first: Int!, $skip: Int!) {
    listings(first: $first, skip: $skip, orderBy: listedAt, orderDirection: desc) {
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
      isSold
      listedAt
      soldAt
      transactionHash
      purchase {
        id
        buyer {
          id
          address
        }
        price
        timestamp
      }
    }
  }
`

// Lấy listings đang active
export const GET_ACTIVE_LISTINGS = gql`
  query GetActiveListings($first: Int!, $skip: Int!) {
    listings(first: $first, skip: $skip, where: { isSold: false }, orderBy: listedAt, orderDirection: desc) {
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
      isSold
      listedAt
      transactionHash
    }
  }
`

// Lấy listings của một user
export const GET_USER_LISTINGS = gql`
  query GetUserListings($seller: String!) {
    listings(where: { seller: $seller }, orderBy: listedAt, orderDirection: desc) {
      id
      listingId
      seller {
        id
        address
      }
      nftAddress
      tokenId
      price
      isSold
      listedAt
      soldAt
      transactionHash
      purchase {
        id
        buyer {
          id
          address
        }
        price
        timestamp
      }
    }
  }
`

// Lấy chi tiết một listing
export const GET_LISTING_DETAIL = gql`
  query GetListingDetail($id: String!) {
    listing(id: $id) {
      id
      listingId
      seller {
        id
        address
        totalListings
        totalSales
        totalVolumeAsSeller
      }
      nftAddress
      tokenId
      price
      isSold
      listedAt
      soldAt
      transactionHash
      purchase {
        id
        buyer {
          id
          address
          totalPurchases
        }
        seller {
          id
          address
        }
        price
        timestamp
        transactionHash
      }
    }
  }
`

// ===================================
// 🛒 PURCHASE QUERIES
// ===================================

// Lấy lịch sử mua bán (purchases) với thông tin đầy đủ
export const GET_PURCHASE_HISTORY = gql`
  query GetPurchaseHistory($first: Int!) {
    purchases(first: $first, orderBy: timestamp, orderDirection: desc) {
      id
      buyer {
        id
        address
        totalPurchases
      }
      seller {
        id
        address
        totalSales
      }
      nftAddress
      tokenId
      price
      timestamp
      transactionHash
      listing {
        id
        listingId
        listedAt
      }
    }
  }
`

// Lấy purchases của một user (as buyer)
export const GET_USER_PURCHASES = gql`
  query GetUserPurchases($buyer: String!) {
    purchases(where: { buyer: $buyer }, orderBy: timestamp, orderDirection: desc) {
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
      listing {
        id
        listingId
      }
    }
  }
`

// Lấy sales của một user (as seller)
export const GET_USER_SALES = gql`
  query GetUserSales($seller: String!) {
    purchases(where: { seller: $seller }, orderBy: timestamp, orderDirection: desc) {
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

// ===================================
// 👤 USER QUERIES
// ===================================

// Lấy thông tin user đầy đủ
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

// Lấy top users theo volume (buyers)
export const GET_TOP_BUYERS = gql`
  query GetTopBuyers($first: Int!) {
    users(first: $first, orderBy: totalVolumeAsBuyer, orderDirection: desc) {
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

// Lấy top users theo volume (sellers)
export const GET_TOP_SELLERS = gql`
  query GetTopSellers($first: Int!) {
    users(first: $first, orderBy: totalVolumeAsSeller, orderDirection: desc) {
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

// ===================================
// 🎨 COLLECTION QUERIES
// ===================================

// Lấy tất cả collections
export const GET_ALL_COLLECTIONS = gql`
  query GetAllCollections($first: Int!, $skip: Int!) {
    collections(first: $first, skip: $skip, orderBy: totalVolume, orderDirection: desc) {
      id
      address
      totalListings
      totalSales
      totalVolume
      floorPrice
      lastSalePrice
    }
  }
`

// Lấy chi tiết một collection
export const GET_COLLECTION_DETAIL = gql`
  query GetCollectionDetail($address: String!) {
    collection(id: $address) {
      id
      address
      totalListings
      totalSales
      totalVolume
      floorPrice
      lastSalePrice
    }
  }
`

// Lấy top collections theo volume
export const GET_TOP_COLLECTIONS = gql`
  query GetTopCollections($first: Int!) {
    collections(first: $first, orderBy: totalVolume, orderDirection: desc) {
      id
      address
      totalListings
      totalSales
      totalVolume
      floorPrice
      lastSalePrice
    }
  }
`

// ===================================
// 📊 MARKETPLACE STATS QUERIES
// ===================================

// Lấy thống kê marketplace từ MarketplaceStat entity
export const GET_MARKETPLACE_STATS = gql`
  query GetMarketplaceStats {
    marketplaceStats(first: 1) {
      id
      totalListings
      totalActiveListings
      totalSales
      totalVolume
      averagePrice
      totalCollections
      totalUsers
      updatedAt
    }
  }
`

// ===================================
// 🔍 SEARCH & FILTER QUERIES
// ===================================

// Lấy listings theo NFT address và token ID
export const GET_LISTINGS_BY_NFT = gql`
  query GetListingsByNFT($nftAddress: String!, $tokenId: String!) {
    listings(where: { nftAddress: $nftAddress, tokenId: $tokenId }, orderBy: listedAt, orderDirection: desc) {
      id
      listingId
      seller {
        id
        address
      }
      price
      isSold
      listedAt
      soldAt
      transactionHash
    }
  }
`

// Lấy listings theo collection (NFT address)
export const GET_LISTINGS_BY_COLLECTION = gql`
  query GetListingsByCollection($nftAddress: String!, $first: Int!, $skip: Int!) {
    listings(
      where: { nftAddress: $nftAddress, isSold: false }, 
      first: $first, 
      skip: $skip, 
      orderBy: listedAt, 
      orderDirection: desc
    ) {
      id
      listingId
      seller {
        id
        address
      }
      nftAddress
      tokenId
      price
      listedAt
      transactionHash
    }
  }
`

// Lấy activity gần đây (listings + purchases)
export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($first: Int!) {
    listings(first: $first, orderBy: listedAt, orderDirection: desc) {
      id
      listingId
      seller {
        id
        address
      }
      nftAddress
      tokenId
      price
      isSold
      listedAt
      transactionHash
    }
    purchases(first: $first, orderBy: timestamp, orderDirection: desc) {
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