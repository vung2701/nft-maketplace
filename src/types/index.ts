// src/types.ts

// NFT interface
export interface NFTItem {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  owner: string;
  isListed: boolean;
  isSold?: boolean;
  price?: string;
  listingId?: number;
}

// ===================================
// 🎯 Updated Subgraph Types
// Synced with new schema.graphql
// ===================================

export interface Listing {
  id: string; // transaction-hash-logIndex
  listingId: string; // On-chain listing ID (BigInt)
  seller: User | string; // Seller (User entity or address)
  nftAddress: string; // Contract address (Bytes)
  tokenId: string; // Token ID (BigInt)
  price: string; // Listing price in Wei (BigInt)
  isSold: boolean; // Sale status
  listedAt: string; // Block timestamp (BigInt)
  soldAt?: string; // Sale timestamp if sold (BigInt)
  transactionHash: string; // Transaction hash (Bytes)
  purchase?: Purchase; // Reference to purchase if sold
}

export interface Purchase {
  id: string; // transaction-hash-logIndex
  listing?: Listing | string; // Reference to original listing
  buyer: User | string; // Buyer (User entity or address)
  seller: User | string; // Seller (User entity or address)
  nftAddress: string; // Contract address (Bytes)
  tokenId: string; // Token ID (BigInt)
  price: string; // Sale price in Wei (BigInt)
  timestamp: string; // Block timestamp (BigInt)
  transactionHash: string; // Transaction hash (Bytes)
}

export interface User {
  id: string; // User address (lowercase)
  address: string; // User address (Bytes)
  totalListings: string; // Number of items listed (BigInt)
  totalPurchases: string; // Number of items bought (BigInt)
  totalSales: string; // Number of items sold (BigInt)
  totalVolumeAsBuyer: string; // Total spent in Wei (BigInt)
  totalVolumeAsSeller: string; // Total earned in Wei (BigInt)
  firstActivityAt: string; // First transaction timestamp (BigInt)
  lastActivityAt: string; // Last transaction timestamp (BigInt)
  listings?: Listing[]; // User's listings
  purchases?: Purchase[]; // User's purchases
  sales?: Purchase[]; // User's sales
}

export interface Collection {
  id: string; // Contract address
  address: string; // Contract address (Bytes)
  totalListings: string; // Total listings ever (BigInt)
  totalSales: string; // Total sales count (BigInt)
  totalVolume: string; // Total volume traded in Wei (BigInt)
  floorPrice: string; // Current floor price (BigInt)
  lastSalePrice: string; // Last sale price (BigInt)
}

export interface MarketplaceStat {
  id: string; // Static: "marketplace-stats"
  totalListings: string; // All-time listings (BigInt)
  totalActiveListings: string; // Currently active (BigInt)
  totalSales: string; // All-time sales (BigInt)
  totalVolume: string; // All-time volume in Wei (BigInt)
  averagePrice: string; // Average sale price (BigInt)
  totalCollections: string; // Unique collections traded (BigInt)
  totalUsers: string; // Unique users (BigInt)
  updatedAt: string; // Last update timestamp (BigInt)
}

// NFT Metadata interface for IPFS/tokenURI data
export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

// ===================================
// 📡 GraphQL Response Types
// ===================================

export interface ListingsResponse {
  listings: Listing[];
}

export interface PurchasesResponse {
  purchases: Purchase[];
}

export interface UserResponse {
  user: User;
}

export interface UsersResponse {
  users: User[];
}

export interface CollectionsResponse {
  collections: Collection[];
}

export interface CollectionResponse {
  collection: Collection;
}

export interface MarketplaceStatsResponse {
  marketplaceStats: MarketplaceStat[];
}

// ===================================
// 🛠️ Utility Types
// ===================================

export interface PaginationParams {
  first: number;
  skip: number;
}

export interface UserStatsDisplay {
  address: string;
  totalVolume: string;
  totalTrades: string;
  avgPrice: string;
  winRate: string;
}