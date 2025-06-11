import { gql } from 'graphql-request'

export const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/112713/nft-marketplace/version/latest'

// Optional headers for authentication (if needed)
export const headers = {
  // Authorization: 'Bearer {api-key}' // Uncomment if API key is required
}

// ===================================
// 📡 Updated GraphQL Queries 
// Synced with new schema
// ===================================

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
  query GetTopUsers($first: Int!) {
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

// ===================================
// 🛠️ Enhanced Utility Functions
// ===================================

export const formatPrice = (price: string | number) => {
  const priceInEth = parseFloat(price.toString()) / 1e18
  return priceInEth.toFixed(4) // Show 4 decimal places for precision
}

export const formatPriceShort = (price: string | number) => {
  const priceInEth = parseFloat(price.toString()) / 1e18
  if (priceInEth >= 1000) {
    return `${(priceInEth / 1000).toFixed(1)}K ETH`
  } else if (priceInEth >= 1) {
    return `${priceInEth.toFixed(2)} ETH`
  } else {
    return `${priceInEth.toFixed(4)} ETH`
  }
}

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatDate = (timestamp: string | number) => {
  return new Date(parseInt(timestamp.toString()) * 1000).toLocaleDateString('vi-VN')
}

export const formatDateTime = (timestamp: string | number) => {
  return new Date(parseInt(timestamp.toString()) * 1000).toLocaleString('vi-VN')
}

export const formatTimeAgo = (timestamp: string | number) => {
  const now = Date.now()
  const time = parseInt(timestamp.toString()) * 1000
  const diff = now - time

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} ngày trước`
  if (hours > 0) return `${hours} giờ trước`
  if (minutes > 0) return `${minutes} phút trước`
  return `${seconds} giây trước`
}

// Volume formatting
export const formatVolume = (volume: string | number) => {
  const volumeInEth = parseFloat(volume.toString()) / 1e18
  if (volumeInEth >= 1000000) {
    return `${(volumeInEth / 1000000).toFixed(1)}M ETH`
  } else if (volumeInEth >= 1000) {
    return `${(volumeInEth / 1000).toFixed(1)}K ETH`
  } else {
    return `${volumeInEth.toFixed(2)} ETH`
  }
}

// Calculate percentage change
export const calculatePercentageChange = (current: string | number, previous: string | number) => {
  const currentNum = parseFloat(current.toString())
  const previousNum = parseFloat(previous.toString())

  if (previousNum === 0) return 0
  return ((currentNum - previousNum) / previousNum) * 100
}

// Convert BigInt string to number for calculations
export const bigIntToNumber = (bigIntStr: string) => {
  return parseInt(bigIntStr)
}

// Get seller info from listing
export const getSellerFromListing = (listing: any) => {
  return typeof listing.seller === 'object' ? listing.seller : { id: listing.seller, address: listing.seller }
}

// Get buyer info from purchase
export const getBuyerFromPurchase = (purchase: any) => {
  return typeof purchase.buyer === 'object' ? purchase.buyer : { id: purchase.buyer, address: purchase.buyer }
} 