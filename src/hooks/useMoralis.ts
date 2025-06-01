import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import {
	getUserNFTs,
	getNFTMetadata,
	getContractNFTs,
	getNFTTransfers,
	getWalletNFTCollections,
	formatNFTForUI,
	type MoralisNFT,
	type NFTCollection
} from '../services/moralis/nft'
import { initializeMoralis, isMoralisReady, getMoralisConfig } from '../services/moralis/client'

// Hook để initialize Moralis
export const useMoralisInit = () => {
	const [isInitialized, setIsInitialized] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const initialize = async () => {
			try {
				setIsLoading(true)
				const success = await initializeMoralis()
				setIsInitialized(success)

				if (!success) {
					setError('Failed to initialize Moralis. Check API key configuration.')
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Unknown error occurred')
				setIsInitialized(false)
			} finally {
				setIsLoading(false)
			}
		}

		initialize()
	}, [])

	return {
		isInitialized,
		isLoading,
		error,
		config: getMoralisConfig(),
		isReady: isMoralisReady()
	}
}

// Hook để lấy NFTs của user hiện tại
export const useUserNFTs = (options: {
	enabled?: boolean
	limit?: number
	chain?: string
} = {}) => {
	const { address } = useAccount()
	const { enabled = true, limit = 10, chain = 'polygon' } = options

	const [nfts, setNfts] = useState<MoralisNFT[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [cursor, setCursor] = useState<string | undefined>()
	const [hasMore, setHasMore] = useState(true)

	const fetchNFTs = useCallback(async (loadMore = false) => {
		if (!address || !enabled || !isMoralisReady()) return

		try {
			setLoading(true)
			setError(null)

			const result = await getUserNFTs(address, chain, {
				limit,
				cursor: loadMore ? cursor : undefined,
				normalizeMetadata: true
			})

			if (result) {
				const newNFTs = result.result || []
				setNfts(prev => loadMore ? [...prev, ...newNFTs] : newNFTs)
				setCursor(result.cursor)
				setHasMore(!!result.cursor)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch NFTs')
		} finally {
			setLoading(false)
		}
	}, [address, enabled, chain, limit, cursor])

	const loadMore = useCallback(() => {
		if (!loading && hasMore) {
			fetchNFTs(true)
		}
	}, [fetchNFTs, loading, hasMore])

	const refresh = useCallback(() => {
		setCursor(undefined)
		setHasMore(true)
		fetchNFTs(false)
	}, [fetchNFTs])

	useEffect(() => {
		if (address && enabled) {
			refresh()
		}
	}, [address, enabled, refresh])

	// Format NFTs for UI
	const formattedNFTs = nfts.map(formatNFTForUI)

	return {
		nfts: formattedNFTs,
		loading,
		error,
		hasMore,
		loadMore,
		refresh,
		total: nfts.length
	}
}

// Hook để lấy NFT metadata cụ thể
export const useNFTMetadata = (contractAddress?: string, tokenId?: string, chain = 'polygon') => {
	const [nft, setNft] = useState<MoralisNFT | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchMetadata = useCallback(async () => {
		if (!contractAddress || !tokenId || !isMoralisReady()) return

		try {
			setLoading(true)
			setError(null)

			const result = await getNFTMetadata(contractAddress, tokenId, chain, {
				normalizeMetadata: true,
				mediaItems: true
			})

			setNft(result)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch NFT metadata')
		} finally {
			setLoading(false)
		}
	}, [contractAddress, tokenId, chain])

	useEffect(() => {
		if (contractAddress && tokenId) {
			fetchMetadata()
		}
	}, [fetchMetadata])

	return {
		nft: nft ? formatNFTForUI(nft) : null,
		loading,
		error,
		refresh: fetchMetadata
	}
}

// Hook để lấy NFTs từ contract cụ thể
export const useContractNFTs = (contractAddress?: string, options: {
	enabled?: boolean
	limit?: number
	chain?: string
} = {}) => {
	const { enabled = true, limit = 10, chain = 'polygon' } = options

	const [nfts, setNfts] = useState<MoralisNFT[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [cursor, setCursor] = useState<string | undefined>()
	const [hasMore, setHasMore] = useState(true)

	const fetchNFTs = useCallback(async (loadMore = false) => {
		if (!contractAddress || !enabled || !isMoralisReady()) return

		try {
			setLoading(true)
			setError(null)

			const result = await getContractNFTs(contractAddress, chain, {
				limit,
				cursor: loadMore ? cursor : undefined,
				normalizeMetadata: true
			})

			if (result) {
				const newNFTs = result.result || []
				setNfts(prev => loadMore ? [...prev, ...newNFTs] : newNFTs)
				setCursor(result.cursor)
				setHasMore(!!result.cursor)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch contract NFTs')
		} finally {
			setLoading(false)
		}
	}, [contractAddress, enabled, chain, limit, cursor])

	const loadMore = useCallback(() => {
		if (!loading && hasMore) {
			fetchNFTs(true)
		}
	}, [fetchNFTs, loading, hasMore])

	const refresh = useCallback(() => {
		setCursor(undefined)
		setHasMore(true)
		fetchNFTs(false)
	}, [fetchNFTs])

	useEffect(() => {
		if (contractAddress && enabled) {
			refresh()
		}
	}, [contractAddress, enabled, refresh])

	const formattedNFTs = nfts.map(formatNFTForUI)

	return {
		nfts: formattedNFTs,
		loading,
		error,
		hasMore,
		loadMore,
		refresh,
		total: nfts.length
	}
}

// Hook để lấy lịch sử transfer của NFT
export const useNFTTransfers = (contractAddress?: string, tokenId?: string, chain = 'polygon') => {
	const [transfers, setTransfers] = useState<any[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchTransfers = useCallback(async () => {
		if (!contractAddress || !tokenId || !isMoralisReady()) return

		try {
			setLoading(true)
			setError(null)

			const result = await getNFTTransfers(contractAddress, tokenId, chain, {
				limit: 20
			})

			if (result?.result) {
				setTransfers(result.result)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch NFT transfers')
		} finally {
			setLoading(false)
		}
	}, [contractAddress, tokenId, chain])

	useEffect(() => {
		if (contractAddress && tokenId) {
			fetchTransfers()
		}
	}, [fetchTransfers])

	return {
		transfers,
		loading,
		error,
		refresh: fetchTransfers
	}
}

// Hook để lấy wallet collections summary
export const useWalletCollections = (walletAddress?: string, chain = 'polygon') => {
	const [collections, setCollections] = useState<any[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchCollections = useCallback(async () => {
		if (!walletAddress || !isMoralisReady()) return

		try {
			setLoading(true)
			setError(null)

			const result = await getWalletNFTCollections(walletAddress, chain)

			if (result?.result) {
				setCollections(result.result)
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch wallet collections')
		} finally {
			setLoading(false)
		}
	}, [walletAddress, chain])

	useEffect(() => {
		if (walletAddress) {
			fetchCollections()
		}
	}, [fetchCollections])

	return {
		collections,
		loading,
		error,
		refresh: fetchCollections
	}
} 