// src/types.ts

// NFT interface
export interface NFTItem {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  owner: string;
  isListed: boolean;
  price?: string;
  listingId?: number;
}

// Essential subgraph types
export interface Listing {
  id: string;
  seller: string;
  nftAddress: string;
  tokenId: string;
  price: string;
  listedAt: string;
  transactionHash: string;
}

export interface Purchase {
  id: string;
  buyer: string;
  seller: string;
  nftAddress: string;
  tokenId: string;
  price: string;
  timestamp: string;
  transactionHash: string;
}

export interface MarketplaceStat {
  id: string;
  totalListings: string;
  totalSales: string;
  totalVolume: string;
  totalActiveListings: string;
  averagePrice: string;
  updatedAt: string;
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

// GraphQL Response types
export interface ListingsResponse {
  listings: Listing[];
}

export interface PurchasesResponse {
  purchases: Purchase[];
}

export interface UserResponse {
  user: User;
}

export interface MarketplaceStatsResponse {
  marketplaceStats: MarketplaceStat[];
}