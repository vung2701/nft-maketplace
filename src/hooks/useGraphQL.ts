import { useQuery } from '@apollo/client'
import {
	GET_ALL_NFTS,
	GET_LISTED_NFTS,
	GET_USER_NFTS,
	GET_NFT_DETAIL,
	GET_SALES_HISTORY,
	GET_MARKETPLACE_STATS
} from '../services/graphqlQueries'

// Hook lấy tất cả NFT
export const useAllNFTs = (first: number = 12, skip: number = 0) => {
	return useQuery(GET_ALL_NFTS, {
		variables: { first, skip },
		fetchPolicy: 'cache-and-network'
	})
}

// Hook lấy NFT đang được bán
export const useListedNFTs = (first: number = 12, skip: number = 0) => {
	return useQuery(GET_LISTED_NFTS, {
		variables: { first, skip },
		fetchPolicy: 'cache-and-network'
	})
}

// Hook lấy NFT của user
export const useUserNFTs = (owner: string) => {
	return useQuery(GET_USER_NFTS, {
		variables: { owner: owner.toLowerCase() },
		skip: !owner,
		fetchPolicy: 'cache-and-network'
	})
}

// Hook lấy chi tiết NFT
export const useNFTDetail = (tokenId: string) => {
	return useQuery(GET_NFT_DETAIL, {
		variables: { tokenId },
		skip: !tokenId,
		fetchPolicy: 'cache-and-network'
	})
}

// Hook lấy lịch sử giao dịch
export const useSalesHistory = (first: number = 20) => {
	return useQuery(GET_SALES_HISTORY, {
		variables: { first },
		fetchPolicy: 'cache-and-network'
	})
}

// Hook thống kê marketplace
export const useMarketplaceStats = () => {
	return useQuery(GET_MARKETPLACE_STATS, {
		fetchPolicy: 'cache-and-network'
	})
}

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