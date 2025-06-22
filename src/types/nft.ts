// NFT Metadata Types
export interface NFTAttribute {
	trait_type: string;
	value: string | number;
	display_type?: 'boost_number' | 'boost_percentage' | 'number' | 'date';
	max_value?: number;
}

export interface NFTMetadata {
	name: string;
	description: string;
	image: string;
	external_url?: string;
	animation_url?: string;
	background_color?: string;
	attributes: NFTAttribute[];
	properties?: Record<string, any>;
}

// Moralis NFT Response Types
export interface MoralisNFTData {
	token_address: string;
	token_id: string;
	owner_of?: string;
	block_number?: string;
	block_number_minted?: string;
	token_hash?: string;
	amount?: string;
	contract_type: string;
	name?: string;
	symbol?: string;
	token_uri?: string;
	metadata?: string | NFTMetadata | null;
	last_token_uri_sync?: string;
	last_metadata_sync?: string;
	minter_address?: string;
	verified_collection?: boolean;
	possible_spam?: boolean;
	collection_logo?: string;
	collection_banner_image?: string;
}

// Processed NFT Data for UI
export interface ProcessedNFT {
	// Basic info
	tokenAddress: string;
	tokenId: string;
	owner: string;

	// Metadata
	name: string;
	description: string;
	image: string;
	externalUrl?: string;
	animationUrl?: string;

	// Attributes
	attributes: NFTAttribute[];

	// Collection info
	collectionName: string;
	collectionSymbol: string;
	collectionLogo?: string;
	collectionBanner?: string;

	// Status
	isSpam: boolean;
	isVerified: boolean;

	// Blockchain info
	chainId: number;
	blockNumber: string;
	minterAddress: string;

	// Sync info
	lastSync: string;
}

// Collection metadata
export interface NFTCollection {
	address: string;
	name: string;
	symbol: string;
	totalSupply?: number;
	description?: string;
	image?: string;
	banner?: string;
	externalUrl?: string;
	isVerified: boolean;
	floorPrice?: {
		value: string;
		currency: string;
	};
	volume24h?: {
		value: string;
		currency: string;
	};
}

// Owner info
export interface NFTOwner {
	address: string;
	ensName?: string;
	avatar?: string;
	tokenCount: number;
}

// Real-time update types
export interface NFTTransfer {
	transactionHash: string;
	from?: string;
	to: string;
	tokenAddress: string;
	tokenId: string;
	timestamp: string;
	blockNumber: string;
	value?: string;
}

// Search/Filter types
export interface NFTSearchFilters {
	collections?: string[];
	priceRange?: {
		min: number;
		max: number;
		currency: string;
	};
	attributes?: {
		trait_type: string;
		values: string[];
	}[];
	chains?: number[];
	verified?: boolean;
	excludeSpam?: boolean;
}

// API Response types
export interface MoralisNFTResponse {
	result: MoralisNFTData[];
	cursor?: string;
	page?: number;
	page_size?: number;
	total?: number;
}

export interface MoralisCollectionResponse {
	result: {
		token_address: string;
		name: string;
		symbol: string;
		contract_type: string;
		synced_at: string;
		possible_spam: boolean;
		verified_collection: boolean;
	}[];
	cursor?: string;
}

// Error types
export interface MoralisError {
	message: string;
	code?: number;
	details?: any;
}

export interface NFTItem {
	tokenId: number;
	name: string;
	description: string;
	image: string;
	owner: string;
	isListed: boolean;
	price?: string;
	listingsId?: number;
	seller: string;
	metadata?: NFTMetadata | string;
} 