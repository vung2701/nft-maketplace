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
  rarity?: NFTRarity;
}

// ===================================
// 🔗 Chainlink Features Types
// ===================================

// Dynamic Pricing Types
export interface Transaction {
  user: string;
  amountETH: string;
  amountUSD: string;
  feeETH: string;
  feeUSD: string;
  timestamp: string;
}

export interface PriceData {
  ethPrice: string; // ETH/USD price from Chainlink
  lastUpdated: string;
}

export interface FeeCalculation {
  feeETH: string;
  feeUSD: string;
  totalETH: string;
  totalUSD: string;
}

// Automated Rewards Types
export interface UserActivity {
  userAddress: string;
  tradingVolume: string;
  transactionCount: string;
  lastActive: string;
}

export interface RewardDistribution {
  timestamp: string;
  recipients: string[];
  amounts: string[];
  totalDistributed: string;
}

export interface UserReward {
  user: string;
  amount: string;
  rank: number;
  percentage: string;
}

// Rarity Verification Types
export interface NFTRarity {
  nftAddress: string;
  tokenId: string;
  rarityScore: string;
  rarityTier: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  traits: string[];
  timestamp: string;
  isVerified: boolean;
}

export interface RarityStats {
  totalVerified: number;
  averageRarity: string;
  distribution: {
    [key: string]: number;
  };
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
  priceInUSD?: string; // Converted price using Chainlink oracle
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
  priceInUSD?: string; // Converted price using Chainlink oracle
  rewardEarned?: string; // Reward points earned from this purchase
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
  rewardBalance?: string; // Current reward token balance
  totalRewardsEarned?: string; // Total rewards earned all time
  rarityScore?: string; // User's average NFT rarity score
}

export interface Collection {
  id: string; // Contract address
  address: string; // Contract address (Bytes)
  totalListings: string; // Total listings ever (BigInt)
  totalSales: string; // Total sales count (BigInt)
  totalVolume: string; // Total volume traded in Wei (BigInt)
  floorPrice: string; // Current floor price (BigInt)
  lastSalePrice: string; // Last sale price (BigInt)
  averageRarity?: string; // Average rarity score of NFTs in collection
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
  totalRewardsDistributed?: string; // Total rewards distributed
  averageRarity?: string; // Average rarity across all NFTs
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
  rewardBalance?: string;
  rarityScore?: string;
}