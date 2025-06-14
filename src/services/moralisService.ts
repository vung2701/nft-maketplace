import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { initializeMoralis, resolveIPFS } from '../config/moralis';
import type {
	ProcessedNFT,
	NFTCollection,
	NFTMetadata,
	NFTTransfer,
	MoralisError
} from '../types/nft';

export class MoralisService {
	private static instance: MoralisService;

	private constructor() { }

	public static getInstance(): MoralisService {
		if (!MoralisService.instance) {
			MoralisService.instance = new MoralisService();
		}
		return MoralisService.instance;
	}



	/**
	 * 🖼️ Lấy NFTs của một user từ tất cả chains
	 */
	async getUserNFTs(
		address: string,
		chainId?: number,
		cursor?: string,
		limit: number = 20
	): Promise<{ nfts: ProcessedNFT[]; cursor?: string }> {
		try {
			const chain = chainId ? EvmChain.create(chainId) : EvmChain.ETHEREUM;

			const response = await Moralis.EvmApi.nft.getWalletNFTs({
				address,
				chain,
				cursor,
				limit,
				excludeSpam: true,
				normalizeMetadata: true
			});

			// Extract result từ response với flexible approach
			const nfts = (response as any)?.result || [];
			const nextCursor = (response as any)?.cursor;

			const processedNFTs = nfts.map((nft: any) => this.processNFTData(nft, chainId || 1));

			return {
				nfts: processedNFTs,
				cursor: nextCursor
			};
		} catch (error) {
			throw this.handleError(error, 'Failed to fetch user NFTs');
		}
	}

	/**
	 * 🎨 Lấy thông tin chi tiết của một NFT cụ thể
	 */
	async getNFTDetails(
		tokenAddress: string,
		tokenId: string,
		chainId: number = 1
	): Promise<ProcessedNFT> {
		try {
			const chain = EvmChain.create(chainId);

			const response = await Moralis.EvmApi.nft.getNFTMetadata({
				address: tokenAddress,
				tokenId,
				chain,
				normalizeMetadata: true
			});

			const nftData = (response as any)?.result || (response as any);
			if (!nftData) {
				throw new Error('No NFT data found');
			}

			return this.processNFTData(nftData, chainId);
		} catch (error) {
			throw this.handleError(error, `Failed to fetch NFT details for ${tokenAddress}:${tokenId}`);
		}
	}

	/**
	 * 📚 Lấy thông tin collection
	 */
	async getCollectionMetadata(
		tokenAddress: string,
		chainId: number = 1
	): Promise<NFTCollection> {
		try {
			const chain = EvmChain.create(chainId);

			const response = await Moralis.EvmApi.nft.getNFTContractMetadata({
				address: tokenAddress,
				chain
			});

			const collectionData = (response as any)?.result || (response as any);
			if (!collectionData) {
				throw new Error('No collection data found');
			}

			return {
				address: tokenAddress,
				name: collectionData.name || 'Unknown Collection',
				symbol: collectionData.symbol || '',
				description: collectionData.contract_type || '',
				isVerified: collectionData.verified_collection || false,
			};
		} catch (error) {
			throw this.handleError(error, `Failed to fetch collection metadata for ${tokenAddress}`);
		}
	}

	/**
	 * 🔍 Tìm kiếm NFTs theo collection
	 */
	async searchNFTsByCollection(
		tokenAddress: string,
		chainId: number = 1,
		cursor?: string,
		limit: number = 20
	): Promise<{ nfts: ProcessedNFT[]; cursor?: string }> {
		try {
			const chain = EvmChain.create(chainId);

			const response = await Moralis.EvmApi.nft.getContractNFTs({
				address: tokenAddress,
				chain,
				cursor,
				limit,
				normalizeMetadata: true
			});

			const nfts = (response as any)?.result || [];
			const nextCursor = (response as any)?.cursor;

			const processedNFTs = nfts.map((nft: any) => this.processNFTData(nft, chainId));

			return {
				nfts: processedNFTs,
				cursor: nextCursor
			};
		} catch (error) {
			throw this.handleError(error, `Failed to search NFTs in collection ${tokenAddress}`);
		}
	}

	/**
	 * 📈 Lấy transfer history của NFT
	 */
	async getNFTTransfers(
		tokenAddress: string,
		tokenId: string,
		chainId: number = 1,
		cursor?: string,
		limit: number = 10
	): Promise<{ transfers: NFTTransfer[]; cursor?: string }> {
		try {
			const chain = EvmChain.create(chainId);

			const response = await Moralis.EvmApi.nft.getNFTTransfers({
				address: tokenAddress,
				tokenId,
				chain,
				cursor,
				limit
			});

			const transfersData = (response as any)?.result || [];
			const nextCursor = (response as any)?.cursor;

			const transfers = transfersData.map((transfer: any) => ({
				transactionHash: transfer.transaction_hash || '',
				from: transfer.from_address || '',
				to: transfer.to_address || '',
				tokenAddress: transfer.token_address || '',
				tokenId: transfer.token_id || '',
				timestamp: transfer.block_timestamp || '',
				blockNumber: transfer.block_number || '',
				value: transfer.value
			}));

			return {
				transfers,
				cursor: nextCursor
			};
		} catch (error) {
			throw this.handleError(error, `Failed to fetch NFT transfers for ${tokenAddress}:${tokenId}`);
		}
	}

	/**
	 * 🔄 Resync NFT metadata
	 */
	async resyncNFTMetadata(
		tokenAddress: string,
		tokenId: string,
		chainId: number = 1
	): Promise<boolean> {
		try {
			const chain = EvmChain.create(chainId);

			await Moralis.EvmApi.nft.reSyncMetadata({
				address: tokenAddress,
				tokenId,
				chain,
				flag: 'uri',
				mode: 'sync'
			});

			return true;
		} catch (error) {
			console.error('Failed to resync NFT metadata:', error);
			return false;
		}
	}

	/**
	 * 🏷️ Lấy owners của một NFT collection
	 */
	async getCollectionOwners(
		tokenAddress: string,
		chainId: number = 1,
		cursor?: string,
		limit: number = 20
	): Promise<{ owners: any[]; cursor?: string }> {
		try {
			const chain = EvmChain.create(chainId);

			const response = await Moralis.EvmApi.nft.getNFTOwners({
				address: tokenAddress,
				chain,
				cursor,
				limit
			});

			const owners = (response as any)?.result || [];
			const nextCursor = (response as any)?.cursor;

			return {
				owners,
				cursor: nextCursor
			};
		} catch (error) {
			throw this.handleError(error, `Failed to fetch collection owners for ${tokenAddress}`);
		}
	}

	/**
	 * 🔄 Process raw NFT data từ Moralis thành ProcessedNFT
	 */
	private processNFTData(nftData: any, chainId: number): ProcessedNFT {
		let metadata: NFTMetadata | null = null;

		// Parse metadata nếu có
		if (nftData.metadata) {
			try {
				metadata = typeof nftData.metadata === 'string'
					? JSON.parse(nftData.metadata)
					: nftData.metadata;

			} catch (error) {
				console.warn('Failed to parse NFT metadata:', error);
			}
		}

		return {
			// Basic info
			tokenAddress: nftData.token_address || '',
			tokenId: nftData.token_id || '',
			owner: nftData.owner_of || '',

			// Metadata
			name: metadata?.name || nftData.name || `#${nftData.token_id || 'Unknown'}`,
			description: metadata?.description || '',
			image: (() => {
				const rawImage = metadata?.image || '';
				const resolvedImage = resolveIPFS(rawImage);
				return resolvedImage;
			})(),
			externalUrl: metadata?.external_url,
			animationUrl: metadata?.animation_url ? resolveIPFS(metadata.animation_url) : undefined,

			// Attributes
			attributes: metadata?.attributes || [],

			// Collection info
			collectionName: nftData.name || 'Unknown Collection',
			collectionSymbol: nftData.symbol || '',
			collectionLogo: nftData.collection_logo,
			collectionBanner: nftData.collection_banner_image,

			// Status
			isSpam: nftData.possible_spam || false,
			isVerified: nftData.verified_collection || false,

			// Blockchain info
			chainId,
			blockNumber: nftData.block_number || '',
			minterAddress: nftData.minter_address || '',

			// Sync info
			lastSync: nftData.last_metadata_sync || ''
		};
	}

	/**
	 * ❌ Error handling helper
	 */
	private handleError(error: any, message: string): MoralisError {
		console.error(message, error);

		return {
			message: message,
			code: error.code || 500,
			details: error.message || error
		};
	}
}

// Export singleton instance
export const moralisService = MoralisService.getInstance(); 