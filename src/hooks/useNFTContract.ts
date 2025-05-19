import { useAccount, useChainId, usePublicClient, useWriteContract } from 'wagmi';
import { NFT_CONTRACTS, MARKETPLACE_CONTRACTS } from '../types/network';
import NFTCollection from '../abis/NFTCollection.json';
import MarketPlace from '../abis/MarketPlace.json';
import { message } from 'antd';
import { convertIpfsToHttp } from '../utils/web3';
import axios from 'axios';
import { NFTItem } from '../types';

export const useNFTContract = () => {
	const { address, isConnected } = useAccount();
	const chainId = useChainId();
	const publicClient = usePublicClient();
	const { writeContractAsync } = useWriteContract();

	const contractAddress = NFT_CONTRACTS[chainId];
	const marketplaceAddress = MARKETPLACE_CONTRACTS[chainId];

	// Kiểm tra điều kiện kết nối
	const checkConnection = () => {
		if (!isConnected || !address) {
			message.error('Vui lòng kết nối ví!');
			return false;
		}
		return true;
	};

	// Lấy thông tin NFT từ tokenURI
	const getNFTMetadata = async (tokenURI: string) => {
		try {
			const { data } = await axios.get(convertIpfsToHttp(tokenURI as string));
			return {
				name: data.name,
				description: data.description,
				image: convertIpfsToHttp(data.image)
			};
		} catch (error) {
			console.error('Error fetching NFT metadata:', error);
			return null;
		}
	};

	// Mint NFT mới
	const mintNFT = async (tokenURI: string) => {
		if (!checkConnection()) return null;

		try {
			const mintTx = await writeContractAsync({
				address: contractAddress as `0x${string}`,
				abi: NFTCollection,
				functionName: 'mintNFT',
				args: [address, tokenURI]
			});
			await publicClient?.waitForTransactionReceipt({ hash: mintTx });
			return mintTx;
		} catch (error) {
			console.error('Error minting NFT:', error);
			throw error;
		}
	};

	// List NFT lên marketplace
	const listNFT = async (tokenId: number, price: bigint) => {
		if (!checkConnection()) return null;

		try {
			// Approve trước
			const approveTx = await writeContractAsync({
				address: contractAddress as `0x${string}`,
				abi: NFTCollection,
				functionName: 'approve',
				args: [marketplaceAddress, BigInt(tokenId)]
			});
			await publicClient?.waitForTransactionReceipt({ hash: approveTx });

			// List NFT
			const listTx = await writeContractAsync({
				address: marketplaceAddress as `0x${string}`,
				abi: MarketPlace,
				functionName: 'listNFT',
				args: [contractAddress, BigInt(tokenId), price]
			});
			await publicClient?.waitForTransactionReceipt({ hash: listTx });
			return listTx;
		} catch (error) {
			console.error('Error listing NFT:', error);
			throw error;
		}
	};

	// Mua NFT từ marketplace
	const buyNFT = async (listingId: number, price: bigint) => {
		if (!checkConnection()) return null;

		try {
			const buyTx = await writeContractAsync({
				address: marketplaceAddress as `0x${string}`,
				abi: MarketPlace,
				functionName: 'buyNFT',
				args: [BigInt(listingId)],
				value: price
			});
			await publicClient?.waitForTransactionReceipt({ hash: buyTx });
			return buyTx;
		} catch (error) {
			console.error('Error buying NFT:', error);
			throw error;
		}
	};

	// Lấy danh sách NFT của user
	const getUserNFTs = async (): Promise<NFTItem[]> => {
		if (!checkConnection()) return [];

		try {
			const nftItems: NFTItem[] = [];
			const tokenCounter = await publicClient?.readContract({
				address: contractAddress as `0x${string}`,
				abi: NFTCollection,
				functionName: 'tokenCounter'
			});

			const listings = await publicClient?.readContract({
				address: marketplaceAddress as `0x${string}`,
				abi: MarketPlace,
				functionName: 'getListings'
			}) as { seller: string; nftAddress: string; tokenId: bigint; price: bigint; isSold: boolean }[];

			for (let tokenId = 0; tokenId < Number(tokenCounter); tokenId++) {
				try {
					const tokenOwner = await publicClient?.readContract({
						address: contractAddress as `0x${string}`,
						abi: NFTCollection,
						functionName: 'ownerOf',
						args: [BigInt(tokenId)]
					});

					if (tokenOwner?.toLowerCase() === address.toLowerCase()) {
						const tokenURI = await publicClient?.readContract({
							address: contractAddress as `0x${string}`,
							abi: NFTCollection,
							functionName: 'tokenURI',
							args: [BigInt(tokenId)]
						});

						const metadata = await getNFTMetadata(tokenURI as string);
						if (!metadata) continue;

						const listing = listings.find(
							(l) =>
								l.nftAddress.toLowerCase() === contractAddress.toLowerCase() &&
								l.tokenId === BigInt(tokenId) &&
								!l.isSold
						);

						if (!listing) {
							nftItems.push({
								tokenId,
								...metadata,
								owner: tokenOwner as string,
								isListed: false
							});
						}
					}
				} catch (error) {
					console.warn(`Error fetching token ${tokenId}:`, error);
				}
			}

			return nftItems;
		} catch (error) {
			console.error('Error fetching user NFTs:', error);
			throw error;
		}
	};

	// Lấy danh sách NFT đang được bán trên marketplace
	const getListedNFTs = async () => {
		if (!checkConnection()) return { myNFTs: [], otherNFTs: [] };

		try {
			const myNFTs: NFTItem[] = [];
			const otherNFTs: NFTItem[] = [];

			const listings = await publicClient?.readContract({
				address: marketplaceAddress as `0x${string}`,
				abi: MarketPlace,
				functionName: 'getListings'
			}) as { seller: string; nftAddress: string; tokenId: bigint; price: bigint; isSold: boolean }[];

			for (const listing of listings) {
				if (listing.nftAddress.toLowerCase() === contractAddress.toLowerCase() && !listing.isSold) {
					try {
						const tokenURI = await publicClient?.readContract({
							address: contractAddress as `0x${string}`,
							abi: NFTCollection,
							functionName: 'tokenURI',
							args: [listing.tokenId]
						});

						const metadata = await getNFTMetadata(tokenURI as string);
						if (!metadata) continue;

						const nftItem: NFTItem = {
							tokenId: Number(listing.tokenId),
							...metadata,
							owner: listing.seller,
							isListed: true,
							price: (Number(listing.price) / 1e18).toString(),
							listingId: listings.indexOf(listing)
						};

						if (listing.seller.toLowerCase() === address.toLowerCase()) {
							myNFTs.push(nftItem);
						} else {
							otherNFTs.push(nftItem);
						}
					} catch (error) {
						console.warn(`Error fetching listing ${listing.tokenId}:`, error);
					}
				}
			}

			return { myNFTs, otherNFTs };
		} catch (error) {
			console.error('Error fetching listed NFTs:', error);
			throw error;
		}
	};

	return {
		mintNFT,
		listNFT,
		buyNFT,
		getUserNFTs,
		getListedNFTs,
		contractAddress,
		marketplaceAddress,
		isConnected,
		address
	};
}; 