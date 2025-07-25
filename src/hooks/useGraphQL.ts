import { useQuery } from '@tanstack/react-query'
import { request } from 'graphql-request'
import {
	SUBGRAPH_URL,
	GET_ACTIVE_LISTINGS,
	GET_PURCHASE_HISTORY,
	GET_MARKETPLACE_STATS,
	GET_TOP_USERS,
	formatPrice,
	formatAddress,
	formatDate,
	formatTimeAgo,
	formatVolume
} from '../services/graphqlClient'

// ===================================
// 📋 CORE HOOKS FOR SUBGRAPH
// ===================================

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
		staleTime: 30 * 1000, // 30 seconds
		retry: 2,
		refetchOnWindowFocus: false
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
		staleTime: 60 * 1000, // 1 minute
		retry: 2,
		refetchOnWindowFocus: false
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
		staleTime: 2 * 60 * 1000, // 2 minutes
		retry: 2,
		refetchOnWindowFocus: true
	})
}

// Hook lấy top users
export const useTopUsers = (first: number = 50) => {
	return useQuery({
		queryKey: ['top-users', first],
		async queryFn() {
			try {
				return await request(SUBGRAPH_URL, GET_TOP_USERS, { first })
			} catch (error) {
				console.log('The Graph Error (Top Users):', error)
				throw new Error('The Graph connection error - feature in development')
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		retry: 2,
		refetchOnWindowFocus: false
	})
}



// ===================================
// 🔄 BACKWARD COMPATIBILITY
// ===================================

// Backward compatibility hooks
export const useListedNFTs = useActiveListings
export const useSalesHistory = usePurchaseHistory

// ===================================
// 🛠️ UTILITY EXPORTS
// ===================================

// Export utility functions for easy import
export {
	formatPrice,
	formatAddress,
	formatDate,
	formatVolume,
	formatTimeAgo
} 