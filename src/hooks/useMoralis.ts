import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moralisService } from '../services/moralisService';
import type { ProcessedNFT, NFTCollection, NFTTransfer } from '../types/nft';

// Query Keys
export const MORALIS_QUERY_KEYS = {
	USER_NFTS: (address: string, chainId?: number) => ['moralis', 'user-nfts', address, chainId],
	NFT_DETAILS: (tokenAddress: string, tokenId: string, chainId: number) =>
		['moralis', 'nft-details', tokenAddress, tokenId, chainId],
	COLLECTION_METADATA: (tokenAddress: string, chainId: number) =>
		['moralis', 'collection-metadata', tokenAddress, chainId],
	COLLECTION_NFTS: (tokenAddress: string, chainId: number) =>
		['moralis', 'collection-nfts', tokenAddress, chainId],
	NFT_TRANSFERS: (tokenAddress: string, tokenId: string, chainId: number) =>
		['moralis', 'nft-transfers', tokenAddress, tokenId, chainId],
	COLLECTION_OWNERS: (tokenAddress: string, chainId: number) =>
		['moralis', 'collection-owners', tokenAddress, chainId],
};

/**
 * 🖼️ Hook để lấy NFTs của user
 */
export const useUserNFTs = (
	address: string | undefined,
	chainId?: number,
	options?: {
		enabled?: boolean;
		refetchInterval?: number;
	}
) => {
	console.log('🔄 useUserNFTs hook được gọi với:', {
		address,
		chainId,
		options
	});

	return useQuery({
		queryKey: MORALIS_QUERY_KEYS.USER_NFTS(address || '', chainId),
		queryFn: async () => {
			if (!address) throw new Error('Address is required');
			console.log('🔍 Đang gọi API để lấy NFTs cho địa chỉ:', address);
			const result = await moralisService.getUserNFTs(address, chainId);
			console.log('✅ Kết quả từ Moralis API:', {
				totalNfts: result.nfts.length,
				cursor: result.cursor,
				firstFewNfts: result.nfts.slice(0, 3)
			});
			return result;
		},
		enabled: !!address && (options?.enabled !== false),
		refetchInterval: options?.refetchInterval || false,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

/**
 * 🎨 Hook để lấy chi tiết NFT
 */
export const useNFTDetails = (
	tokenAddress: string | undefined,
	tokenId: string | undefined,
	chainId: number = 1,
	options?: {
		enabled?: boolean;
	}
) => {
	return useQuery({
		queryKey: MORALIS_QUERY_KEYS.NFT_DETAILS(tokenAddress || '', tokenId || '', chainId),
		queryFn: async () => {
			if (!tokenAddress || !tokenId) throw new Error('Token address and ID are required');
			return await moralisService.getNFTDetails(tokenAddress, tokenId, chainId);
		},
		enabled: !!tokenAddress && !!tokenId && (options?.enabled !== false),
		staleTime: 10 * 60 * 1000, // 10 minutes - NFT metadata không thay đổi thường xuyên
		gcTime: 30 * 60 * 1000, // 30 minutes
	});
};

/**
 * 📚 Hook để lấy thông tin collection
 */
export const useCollectionMetadata = (
	tokenAddress: string | undefined,
	chainId: number = 1,
	options?: {
		enabled?: boolean;
	}
) => {
	return useQuery({
		queryKey: MORALIS_QUERY_KEYS.COLLECTION_METADATA(tokenAddress || '', chainId),
		queryFn: async () => {
			if (!tokenAddress) throw new Error('Token address is required');
			return await moralisService.getCollectionMetadata(tokenAddress, chainId);
		},
		enabled: !!tokenAddress && (options?.enabled !== false),
		staleTime: 15 * 60 * 1000, // 15 minutes
		gcTime: 30 * 60 * 1000, // 30 minutes
	});
};

/**
 * 🔍 Hook để lấy NFTs trong collection
 */
export const useCollectionNFTs = (
	tokenAddress: string | undefined,
	chainId: number = 1,
	options?: {
		enabled?: boolean;
		limit?: number;
	}
) => {
	return useQuery({
		queryKey: MORALIS_QUERY_KEYS.COLLECTION_NFTS(tokenAddress || '', chainId),
		queryFn: async () => {
			if (!tokenAddress) throw new Error('Token address is required');
			return await moralisService.searchNFTsByCollection(
				tokenAddress,
				chainId,
				undefined,
				options?.limit || 20
			);
		},
		enabled: !!tokenAddress && (options?.enabled !== false),
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 15 * 60 * 1000, // 15 minutes
	});
};

/**
 * 📈 Hook để lấy transfer history
 */
export const useNFTTransfers = (
	tokenAddress: string | undefined,
	tokenId: string | undefined,
	chainId: number = 1,
	options?: {
		enabled?: boolean;
		limit?: number;
	}
) => {
	return useQuery({
		queryKey: MORALIS_QUERY_KEYS.NFT_TRANSFERS(tokenAddress || '', tokenId || '', chainId),
		queryFn: async () => {
			if (!tokenAddress || !tokenId) throw new Error('Token address and ID are required');
			return await moralisService.getNFTTransfers(
				tokenAddress,
				tokenId,
				chainId,
				undefined,
				options?.limit || 10
			);
		},
		enabled: !!tokenAddress && !!tokenId && (options?.enabled !== false),
		staleTime: 2 * 60 * 1000, // 2 minutes - transfer data cần update thường xuyên hơn
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
};

/**
 * 🏷️ Hook để lấy owners của collection
 */
export const useCollectionOwners = (
	tokenAddress: string | undefined,
	chainId: number = 1,
	options?: {
		enabled?: boolean;
		limit?: number;
	}
) => {
	return useQuery({
		queryKey: MORALIS_QUERY_KEYS.COLLECTION_OWNERS(tokenAddress || '', chainId),
		queryFn: async () => {
			if (!tokenAddress) throw new Error('Token address is required');
			return await moralisService.getCollectionOwners(
				tokenAddress,
				chainId,
				undefined,
				options?.limit || 20
			);
		},
		enabled: !!tokenAddress && (options?.enabled !== false),
		staleTime: 10 * 60 * 1000, // 10 minutes
		gcTime: 20 * 60 * 1000, // 20 minutes
	});
};

/**
 * 🔄 Hook để resync NFT metadata
 */
export const useResyncNFTMetadata = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			tokenAddress,
			tokenId,
			chainId
		}: {
			tokenAddress: string;
			tokenId: string;
			chainId: number;
		}) => {
			return await moralisService.resyncNFTMetadata(tokenAddress, tokenId, chainId);
		},
		onSuccess: (_, variables) => {
			// Invalidate related queries sau khi resync
			queryClient.invalidateQueries({
				queryKey: MORALIS_QUERY_KEYS.NFT_DETAILS(variables.tokenAddress, variables.tokenId, variables.chainId)
			});
			queryClient.invalidateQueries({
				queryKey: MORALIS_QUERY_KEYS.COLLECTION_NFTS(variables.tokenAddress, variables.chainId)
			});
		},
	});
};

/**
 * 🔄 Hook để refresh data real-time
 */
export const useRefreshNFTData = () => {
	const queryClient = useQueryClient();

	const refreshUserNFTs = (address: string, chainId?: number) => {
		queryClient.invalidateQueries({
			queryKey: MORALIS_QUERY_KEYS.USER_NFTS(address, chainId)
		});
	};

	const refreshNFTDetails = (tokenAddress: string, tokenId: string, chainId: number) => {
		queryClient.invalidateQueries({
			queryKey: MORALIS_QUERY_KEYS.NFT_DETAILS(tokenAddress, tokenId, chainId)
		});
	};

	const refreshCollectionData = (tokenAddress: string, chainId: number) => {
		queryClient.invalidateQueries({
			queryKey: MORALIS_QUERY_KEYS.COLLECTION_METADATA(tokenAddress, chainId)
		});
		queryClient.invalidateQueries({
			queryKey: MORALIS_QUERY_KEYS.COLLECTION_NFTS(tokenAddress, chainId)
		});
	};

	return {
		refreshUserNFTs,
		refreshNFTDetails,
		refreshCollectionData,
	};
};

/**
 * 🎯 Hook tổng hợp cho NFT marketplace
 */
export const useNFTMarketplace = (address?: string, chainId?: number) => {
	const userNFTs = useUserNFTs(address, chainId);
	const refreshData = useRefreshNFTData();
	const resync = useResyncNFTMetadata();

	return {
		// Data
		nfts: userNFTs.data?.nfts || [],
		cursor: userNFTs.data?.cursor,

		// States
		isLoading: userNFTs.isLoading,
		isError: userNFTs.isError,
		error: userNFTs.error,

		// Actions
		refetch: userNFTs.refetch,
		refreshData,
		resyncMetadata: resync.mutate,
		isResyncing: resync.isPending,
	};
}; 