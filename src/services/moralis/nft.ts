import Moralis from 'moralis'
import { isMoralisReady, MORALIS_CONFIG, getChainId } from './client'

// Types for NFT data - updated to match Moralis response
export interface MoralisNFT {
	token_address: string
	token_id: string
	owner_of?: string
	token_hash?: string
	block_number?: string
	block_number_minted?: string
	token_uri?: string
	metadata?: string
	normalized_metadata?: {
		name?: string
		description?: string
		image?: string
		external_url?: string
		attributes?: Array<{
			trait_type: string
			value: string | number
		}>
	}
	amount?: string
	name?: string
	symbol?: string
	contract_type: string
	last_metadata_sync?: string
	last_token_uri_sync?: string
}

export interface NFTCollection {
	total?: number
	page?: number
	page_size?: number
	result: MoralisNFT[]
	cursor?: string
}

// Get NFTs owned by a specific wallet
export const getUserNFTs = async (
	walletAddress: string,
	chain: string = 'polygon',
	options: {
		limit?: number
		cursor?: string
		format?: 'decimal' | 'hex'
		normalizeMetadata?: boolean
		mediaItems?: boolean
	} = {}
): Promise<NFTCollection | null> => {

	if (!isMoralisReady()) {
		console.warn('⚠️ Moralis not ready for getUserNFTs')
		return null
	}

	try {
		const {
			limit = 10,
			cursor,
			format = 'decimal',
			normalizeMetadata = true,
			mediaItems = false
		} = options

		// Convert chain name to chain ID
		const chainId = getChainId(chain)
		console.log(`🔗 Fetching user NFTs on chain: ${chain} (${chainId})`)

		const response = await Moralis.EvmApi.nft.getWalletNFTs({
			address: walletAddress,
			chain: chainId,
			limit,
			cursor,
			format,
			normalizeMetadata,
			mediaItems
		})

		const data = response.toJSON()
		console.log(`✅ Fetched ${data.result?.length || 0} NFTs for ${walletAddress} on ${chain}`)
		return data as NFTCollection

	} catch (error) {
		console.error('❌ Error fetching user NFTs:', error)
		if (error instanceof Error && error.message.includes('chain')) {
			console.error(`💡 Chain error - tried to use: ${chain} -> ${getChainId(chain)}`)
		}
		return null
	}
}

// Get NFT metadata by contract and token ID
export const getNFTMetadata = async (
	contractAddress: string,
	tokenId: string,
	chain: string = 'polygon',
	options: {
		format?: 'decimal' | 'hex'
		normalizeMetadata?: boolean
		mediaItems?: boolean
	} = {}
): Promise<MoralisNFT | null> => {

	if (!isMoralisReady()) {
		console.warn('⚠️ Moralis not ready for getNFTMetadata')
		return null
	}

	try {
		const {
			format = 'decimal',
			normalizeMetadata = true,
			mediaItems = false
		} = options

		const chainId = getChainId(chain)
		console.log(`🔗 Fetching NFT metadata on chain: ${chain} (${chainId})`)

		const response = await Moralis.EvmApi.nft.getNFTMetadata({
			address: contractAddress,
			tokenId,
			chain: chainId,
			format,
			normalizeMetadata,
			mediaItems
		})

		if (!response) {
			console.warn('⚠️ No response from getNFTMetadata')
			return null
		}

		const data = response.toJSON()
		console.log(`✅ Fetched metadata for NFT ${tokenId}`)
		return data as MoralisNFT

	} catch (error) {
		console.error('❌ Error fetching NFT metadata:', error)
		return null
	}
}

// Get NFT transfers (transaction history)
export const getNFTTransfers = async (
	contractAddress: string,
	tokenId: string,
	chain: string = 'polygon',
	options: {
		limit?: number
		cursor?: string
		format?: 'decimal' | 'hex'
	} = {}
): Promise<any> => {

	if (!isMoralisReady()) {
		console.warn('⚠️ Moralis not ready for getNFTTransfers')
		return null
	}

	try {
		const {
			limit = 10,
			cursor,
			format = 'decimal'
		} = options

		const chainId = getChainId(chain)

		const response = await Moralis.EvmApi.nft.getNFTTransfers({
			address: contractAddress,
			tokenId,
			chain: chainId,
			limit,
			cursor,
			format
		})

		const data = response.toJSON()
		console.log(`✅ Fetched ${data.result?.length || 0} transfers for NFT ${tokenId}`)
		return data

	} catch (error) {
		console.error('❌ Error fetching NFT transfers:', error)
		return null
	}
}

// Get NFTs by contract address
export const getContractNFTs = async (
	contractAddress: string,
	chain: string = 'polygon',
	options: {
		limit?: number
		cursor?: string
		format?: 'decimal' | 'hex'
		normalizeMetadata?: boolean
	} = {}
): Promise<NFTCollection | null> => {

	if (!isMoralisReady()) {
		console.warn('⚠️ Moralis not ready for getContractNFTs')
		return null
	}

	try {
		const {
			limit = 10,
			cursor,
			format = 'decimal',
			normalizeMetadata = true
		} = options

		const chainId = getChainId(chain)
		console.log(`🔗 Fetching contract NFTs on chain: ${chain} (${chainId})`)

		const response = await Moralis.EvmApi.nft.getContractNFTs({
			address: contractAddress,
			chain: chainId,
			limit,
			cursor,
			format,
			normalizeMetadata
		})

		const data = response.toJSON()
		console.log(`✅ Fetched ${data.result?.length || 0} NFTs from contract ${contractAddress}`)
		return data as NFTCollection

	} catch (error) {
		console.error('❌ Error fetching contract NFTs:', error)
		return null
	}
}

// Utility function to format NFT data for UI
export const formatNFTForUI = (nft: MoralisNFT) => {
	const metadata = nft.normalized_metadata || {}

	return {
		id: `${nft.token_address}_${nft.token_id}`,
		tokenId: nft.token_id,
		contractAddress: nft.token_address,
		owner: nft.owner_of || 'Unknown',
		name: metadata.name || `#${nft.token_id}`,
		description: metadata.description || '',
		image: metadata.image || nft.token_uri || '/placeholder-nft.png',
		attributes: metadata.attributes || [],
		tokenUri: nft.token_uri || '',
		contractType: nft.contract_type,
		symbol: nft.symbol || '',
		// Add computed properties
		shortAddress: `${nft.token_address.slice(0, 6)}...${nft.token_address.slice(-4)}`,
		shortOwner: nft.owner_of ? `${nft.owner_of.slice(0, 6)}...${nft.owner_of.slice(-4)}` : 'Unknown',
		lastSync: nft.last_metadata_sync
	}
}

// Get wallet NFT collections summary
export const getWalletNFTCollections = async (
	walletAddress: string,
	chain: string = 'polygon'
): Promise<any> => {

	if (!isMoralisReady()) {
		console.warn('⚠️ Moralis not ready for getWalletNFTCollections')
		return null
	}

	try {
		const chainId = getChainId(chain)

		const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
			address: walletAddress,
			chain: chainId
		})

		const data = response.toJSON()
		console.log(`✅ Fetched ${data.result?.length || 0} collections for ${walletAddress}`)
		return data

	} catch (error) {
		console.error('❌ Error fetching wallet collections:', error)
		return null
	}
} 