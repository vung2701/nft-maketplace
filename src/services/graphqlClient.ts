import { gql } from 'graphql-request'

export const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/112713/nft-marketplace/version/latest'

// Optional headers for authentication (if needed)
export const headers = {
  // Authorization: 'Bearer {api-key}' // Uncomment if API key is required
}

// GraphQL queries
export const GET_ALL_LISTINGS = gql`
  query GetAllListings($first: Int!, $skip: Int!) {
    listings(first: $first, skip: $skip, orderBy: listedAt, orderDirection: desc) {
      id
      listingId
      seller
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

export const GET_ACTIVE_LISTINGS = gql`
  query GetActiveListings($first: Int!, $skip: Int!) {
    listings(first: $first, skip: $skip, where: { isSold: false }, orderBy: listedAt, orderDirection: desc) {
      id
      seller
      nftAddress
      tokenId
      price
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
      seller
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

export const GET_LISTING_DETAIL = gql`
  query GetListingDetail($id: String!) {
    listing(id: $id) {
      id
      listingId
      seller
      nftAddress
      tokenId
      price
      isSold
      listedAt
      soldAt
      transactionHash
      purchase {
        id
        buyer
        seller
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
      buyer
      seller
      nftAddress
      tokenId
      price
      timestamp
      transactionHash
    }
  }
`

export const GET_MARKETPLACE_STATS = gql`
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
    }
  }
`

// Utility functions
export const formatPrice = (price: string | number) => {
  return parseFloat(price.toString()) / 1e18 // Convert từ wei sang ETH
}

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatDate = (timestamp: string | number) => {
  return new Date(parseInt(timestamp.toString()) * 1000).toLocaleDateString()
} 