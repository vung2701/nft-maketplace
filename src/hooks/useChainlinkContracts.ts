import { useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseUnits, formatUnits, getContract } from 'viem';
import { toast } from 'react-hot-toast';

// Import ABIs
import DynamicPricingABI from '../abis/DynamicPricing.json';
import AutomatedRewardsABI from '../abis/AutomatedRewards.json';
import RarityVerificationABI from '../abis/RarityVerification.json';
import RewardTokenABI from '../abis/RewardToken.json';

// Import types
import type {
	Transaction,
	FeeCalculation,
	UserActivity,
	RewardDistribution,
	UserReward,
	NFTRarity,
} from '../types';

import { CONTRACT_ADDRESSES, MESSAGES } from '../constants';

export function useChainlinkContracts() {
	const { address, isConnected } = useAccount();
	const publicClient = usePublicClient();
	const { data: walletClient } = useWalletClient();

	// States
	const [ethPrice, setEthPrice] = useState<string>('0');
	const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
	const [userRewards, setUserRewards] = useState<string>('0');
	const [isLoading, setIsLoading] = useState(false);

	// Contract instances
	const getDynamicPricingContract = useCallback(() => {
		if (!publicClient) return null;
		return getContract({
			address: CONTRACT_ADDRESSES.DYNAMIC_PRICING as `0x${string}`,
			abi: DynamicPricingABI,
			client: publicClient,
		});
	}, [publicClient]);

	const getAutomatedRewardsContract = useCallback(() => {
		if (!publicClient) return null;

		console.log('Using Automated Rewards Contract Address:', CONTRACT_ADDRESSES.AUTOMATED_REWARDS);
		console.log('Using Automated Rewards Contract Address:', CONTRACT_ADDRESSES.AUTOMATED_REWARDS as `0x${string}`);
		return getContract({
			address: CONTRACT_ADDRESSES.AUTOMATED_REWARDS as `0x${string}`,
			abi: AutomatedRewardsABI,
			client: publicClient,
		});
	}, [publicClient]);

	const getRarityVerificationContract = useCallback(() => {
		if (!publicClient) return null;
		return getContract({
			address: CONTRACT_ADDRESSES.RARITY_VERIFICATION as `0x${string}`,
			abi: RarityVerificationABI,
			client: publicClient,
		});
	}, [publicClient]);

	const getRewardTokenContract = useCallback(() => {
		if (!publicClient) return null;
		return getContract({
			address: CONTRACT_ADDRESSES.REWARD_TOKEN as `0x${string}`,
			abi: RewardTokenABI,
			client: publicClient,
		});
	}, [publicClient]);

	// ===================================
	// 💰 Dynamic Pricing Functions
	// ===================================

	const getLatestPrice = useCallback(async (): Promise<string> => {
		try {
			const contract = getDynamicPricingContract();
			if (!contract) throw new Error('Contract not available');

			const price = await contract.read.getLatestPrice();
			return formatUnits(price as bigint, 8); // Chainlink price has 8 decimals
		} catch (error) {
			console.error('Error getting latest price:', error);
			return '0';
		}
	}, [getDynamicPricingContract]);

	const calculateFee = useCallback(async (ethAmount: string): Promise<FeeCalculation> => {
		try {
			const contract = getDynamicPricingContract();
			if (!contract) throw new Error('Contract not available');

			const amountWei = parseUnits(ethAmount, 18);
			const result = await contract.read.calculateFee([amountWei]);

			const [feeETH, feeUSD] = result as [bigint, bigint];

			return {
				feeETH: formatUnits(feeETH, 18),
				feeUSD: formatUnits(feeUSD, 18),
				totalETH: ethAmount,
				totalUSD: formatUnits(BigInt(ethAmount) * BigInt(await getLatestPrice()) * BigInt(1e10), 18)
			};
		} catch (error) {
			console.error('Error calculating fee:', error);
			return { feeETH: '0', feeUSD: '0', totalETH: '0', totalUSD: '0' };
		}
	}, [getDynamicPricingContract, getLatestPrice]);

	const payFee = useCallback(async (ethAmount: string): Promise<boolean> => {
		try {
			if (!walletClient || !address) throw new Error('Wallet not connected');

			const contract = getContract({
				address: CONTRACT_ADDRESSES.DYNAMIC_PRICING as `0x${string}`,
				abi: DynamicPricingABI,
				client: walletClient,
			});

			const amountWei = parseUnits(ethAmount, 18);
			const hash = await contract.write.payFee([], { value: amountWei });

			await publicClient?.waitForTransactionReceipt({ hash });
			toast.success(MESSAGES.FEE_PAYMENT_SUCCESS);
			return true;
		} catch (error) {
			console.error('Error paying fee:', error);
			toast.error(`${MESSAGES.FEE_PAYMENT_FAILED}${error}`);
			return false;
		}
	}, [walletClient, address, publicClient]);

	const getAllTransactions = useCallback(async (): Promise<Transaction[]> => {
		try {
			const contract = getDynamicPricingContract();
			if (!contract) return [];

			try {
				const transactions = await contract.read.getAllTransactions();
				return (transactions as any[]).map(tx => ({
					user: tx.user,
					amountETH: formatUnits(tx.amountETH as bigint, 18),
					amountUSD: formatUnits(tx.amountUSD as bigint, 18),
					feeETH: formatUnits(tx.feeETH as bigint, 18),
					feeUSD: formatUnits(tx.feeUSD as bigint, 18),
					timestamp: (tx.timestamp as bigint).toString(),
				}));
			} catch (contractError: any) {
				console.warn('Contract not deployed or error calling getAllTransactions:', contractError.message);
				// Trả về mock data
				return [
					{
						user: '0x1234567890123456789012345678901234567890',
						amountETH: '1.5',
						amountUSD: '3000.00',
						feeETH: '0.03',
						feeUSD: '60.00',
						timestamp: Math.floor(Date.now() / 1000).toString(),
					},
					{
						user: '0x2345678901234567890123456789012345678901',
						amountETH: '0.8',
						amountUSD: '1600.00',
						feeETH: '0.016',
						feeUSD: '32.00',
						timestamp: Math.floor(Date.now() / 1000 - 3600).toString(),
					}
				];
			}
		} catch (error) {
			console.error('Error getting transactions:', error);
			return [];
		}
	}, [getDynamicPricingContract]);

	// ===================================
	// 🎁 Automated Rewards Functions
	// ===================================

	const getUserActivity = useCallback(async (userAddress?: string): Promise<UserActivity | null> => {
		try {
			const contract = getAutomatedRewardsContract();
			if (!contract) return null;

			const targetAddress = userAddress || address;
			if (!targetAddress) return null;

			const activity = await contract.read.getUserActivity([targetAddress]);
			return {
				userAddress: (activity as any).userAddress,
				tradingVolume: formatUnits((activity as any).tradingVolume as bigint, 18),
				transactionCount: ((activity as any).transactionCount as bigint).toString(),
				lastActive: ((activity as any).lastActive as bigint).toString(),
			};
		} catch (error) {
			console.error('Error getting user activity:', error);
			return null;
		}
	}, [getAutomatedRewardsContract, address]);

	const getTopTraders = useCallback(async (): Promise<UserReward[]> => {
		try {
			const contract = getAutomatedRewardsContract();
			if (!contract) return [];

			// Kiểm tra xem contract có tồn tại không
			try {
				const result = await contract.read.getTopTraders();
				const [traders, volumes] = result as [string[], bigint[]];

				if (!traders || !volumes || traders.length === 0) {
					return [];
				}

				return traders.map((trader, index) => ({
					user: trader,
					amount: formatUnits(volumes[index], 18),
					rank: index + 1,
					percentage: ((Number(formatUnits(volumes[index], 18)) / Number(formatUnits(volumes.reduce((a, b) => a + b, 0n), 18))) * 100).toFixed(2)
				}));
			} catch (contractError: any) {
				// Nếu contract chưa được deploy hoặc có lỗi, trả về mock data
				console.warn('Contract not deployed or error calling getTopTraders:', contractError.message);

				// Trả về mock data để demo UI
				return [
					{
						user: '0x1234567890123456789012345678901234567890',
						amount: '10.5',
						rank: 1,
						percentage: '45.50'
					},
					{
						user: '0x2345678901234567890123456789012345678901',
						amount: '8.2',
						rank: 2,
						percentage: '35.50'
					},
					{
						user: '0x3456789012345678901234567890123456789012',
						amount: '4.3',
						rank: 3,
						percentage: '19.00'
					}
				];
			}
		} catch (error) {
			console.error('Error getting top traders:', error);
			return [];
		}
	}, [getAutomatedRewardsContract]);

	const getRewardHistory = useCallback(async (): Promise<RewardDistribution[]> => {
		try {
			const contract = getAutomatedRewardsContract();
			if (!contract) return [];

			try {
				const history = await contract.read.getRewardHistory();
				return (history as any[]).map(dist => ({
					timestamp: (dist.timestamp as bigint).toString(),
					recipients: dist.recipients,
					amounts: (dist.amounts as bigint[]).map(amount => formatUnits(amount, 18)),
					totalDistributed: formatUnits(dist.totalDistributed as bigint, 18),
				}));
			} catch (contractError: any) {
				console.warn('Contract not deployed or error calling getRewardHistory:', contractError.message);
				// Trả về mock data
				return [
					{
						timestamp: Math.floor(Date.now() / 1000).toString(),
						recipients: ['0x1234567890123456789012345678901234567890'],
						amounts: ['5.0'],
						totalDistributed: '5.0',
					}
				];
			}
		} catch (error) {
			console.error('Error getting reward history:', error);
			return [];
		}
	}, [getAutomatedRewardsContract]);

	const getRewardBalance = useCallback(async (userAddress?: string): Promise<string> => {
		try {
			const contract = getRewardTokenContract();
			if (!contract) return '0';

			const targetAddress = userAddress || address;
			if (!targetAddress) return '0';

			const balance = await contract.read.balanceOf([targetAddress]);
			return formatUnits(balance as bigint, 18);
		} catch (error) {
			console.error('Error getting reward balance:', error);
			return '0';
		}
	}, [getRewardTokenContract, address]);

	// ===================================
	// 🎭 Rarity Verification Functions
	// ===================================

	const requestRarityVerification = useCallback(async (
		nftAddress: string,
		tokenId: string,
		traits: string[]
	): Promise<boolean> => {
		try {
			if (!walletClient || !address) throw new Error('Wallet not connected');

			const contract = getContract({
				address: CONTRACT_ADDRESSES.RARITY_VERIFICATION as `0x${string}`,
				abi: RarityVerificationABI,
				client: walletClient,
			});

			const hash = await contract.write.requestRarityVerification([
				nftAddress as `0x${string}`,
				BigInt(tokenId),
				traits
			]);

			await publicClient?.waitForTransactionReceipt({ hash });
			toast.success(MESSAGES.RARITY_REQUEST_SUCCESS);
			return true;
		} catch (error) {
			console.error('Error requesting rarity verification:', error);
			toast.error(`${MESSAGES.RARITY_REQUEST_FAILED}${error}`);
			return false;
		}
	}, [walletClient, address, publicClient]);

	const getNFTRarity = useCallback(async (
		nftAddress: string,
		tokenId: string
	): Promise<NFTRarity | null> => {
		try {
			const contract = getRarityVerificationContract();
			if (!contract) return null;

			const rarity = await contract.read.getNFTRarity([
				nftAddress as `0x${string}`,
				BigInt(tokenId)
			]);

			return {
				nftAddress: (rarity as any).nftAddress,
				tokenId: ((rarity as any).tokenId as bigint).toString(),
				rarityScore: ((rarity as any).rarityScore as bigint).toString(),
				rarityTier: (rarity as any).rarityTier,
				traits: (rarity as any).traits,
				timestamp: ((rarity as any).timestamp as bigint).toString(),
				isVerified: (rarity as any).isVerified,
			};
		} catch (error) {
			console.error('Error getting NFT rarity:', error);
			return null;
		}
	}, [getRarityVerificationContract]);

	const getAllRarities = useCallback(async (): Promise<NFTRarity[]> => {
		try {
			const contract = getRarityVerificationContract();
			if (!contract) return [];

			try {
				const rarities = await contract.read.getAllRarities();
				return (rarities as any[]).map(rarity => ({
					nftAddress: rarity.nftAddress,
					tokenId: (rarity.tokenId as bigint).toString(),
					rarityScore: (rarity.rarityScore as bigint).toString(),
					rarityTier: rarity.rarityTier,
					traits: rarity.traits,
					timestamp: (rarity.timestamp as bigint).toString(),
					isVerified: rarity.isVerified,
				}));
			} catch (contractError: any) {
				console.warn('Contract not deployed or error calling getAllRarities:', contractError.message);
				// Trả về mock data
				return [
					{
						nftAddress: '0x1234567890123456789012345678901234567890',
						tokenId: '1',
						rarityScore: '8500',
						rarityTier: 'Rare',
						traits: ['Golden Background', 'Diamond Eyes'],
						timestamp: Math.floor(Date.now() / 1000).toString(),
						isVerified: true,
					},
					{
						nftAddress: '0x2345678901234567890123456789012345678901',
						tokenId: '2',
						rarityScore: '9200',
						rarityTier: 'Epic',
						traits: ['Rainbow Wings', 'Laser Eyes'],
						timestamp: Math.floor(Date.now() / 1000 - 3600).toString(),
						isVerified: false,
					}
				];
			}
		} catch (error) {
			console.error('Error getting all rarities:', error);
			return [];
		}
	}, [getRarityVerificationContract]);

	// ===================================
	// 🔄 Auto Update Effects
	// ===================================

	useEffect(() => {
		const updatePriceData = async () => {
			const price = await getLatestPrice();
			setEthPrice(price);
		};

		const updateUserData = async () => {
			if (address) {
				const activity = await getUserActivity();
				setUserActivity(activity);

				const rewards = await getRewardBalance();
				setUserRewards(rewards);
			}
		};

		updatePriceData();
		updateUserData();

		// Update every 30 seconds
		const interval = setInterval(() => {
			updatePriceData();
			updateUserData();
		}, 30000);

		return () => clearInterval(interval);
	}, [address, getLatestPrice, getUserActivity, getRewardBalance]);

	return {
		// States
		ethPrice,
		userActivity,
		userRewards,
		isLoading,

		// Dynamic Pricing
		getLatestPrice,
		calculateFee,
		payFee,
		getAllTransactions,

		// Automated Rewards
		getUserActivity,
		getTopTraders,
		getRewardHistory,
		getRewardBalance,

		// Rarity Verification
		requestRarityVerification,
		getNFTRarity,
		getAllRarities,
	};
} 