import { useQuery } from '@tanstack/react-query'
import { request } from 'graphql-request'
import {
	SUBGRAPH_URL,
	GET_ACTIVE_LISTINGS,
	GET_PURCHASE_HISTORY,
	GET_MARKETPLACE_STATS,
	formatPrice,
	formatAddress,
	formatDate
} from '../services/graphqlClient'

// Hook lấy listings đang active
export const useActiveListings = (first: number = 12, skip: number = 0) => {
	return useQuery({
		queryKey: ['active-listings', first, skip],
		async queryFn() {
			try {
				return await request(SUBGRAPH_URL, GET_ACTIVE_LISTINGS, { first, skip })
			} catch (error) {
				console.log('The Graph Error (Active Listings):', error)
				throw new Error('The Graph connection error - feature in development')
			}
		},
		staleTime: 60 * 1000,
		retry: 1
	})
}

// Hook lấy lịch sử mua bán
export const usePurchaseHistory = (first: number = 20) => {
	return useQuery({
		queryKey: ['purchase-history', first],
		async queryFn() {
			try {
				return await request(SUBGRAPH_URL, GET_PURCHASE_HISTORY, { first })
			} catch (error) {
				console.log('The Graph Error (Purchase History):', error)
				throw new Error('The Graph connection error - feature in development')
			}
		},
		staleTime: 60 * 1000,
		retry: 1
	})
}

// Hook thống kê marketplace
export const useMarketplaceStats = () => {
	return useQuery({
		queryKey: ['marketplace-stats'],
		async queryFn() {
			try {
				return await request(SUBGRAPH_URL, GET_MARKETPLACE_STATS, {})
			} catch (error) {
				console.log('The Graph Error (Marketplace Stats):', error)
				throw new Error('The Graph connection error - feature in development')
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes for stats
		retry: 1
	})
}

// Backward compatibility
export const useListedNFTs = useActiveListings
export const useSalesHistory = usePurchaseHistory

// Export utility functions
export { formatPrice, formatAddress, formatDate } 