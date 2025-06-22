// Real-world data service
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const ETHERSCAN_API = 'https://api.etherscan.io/api';
const ETHGAS_API = 'https://ethgasstation.info/api';

// Ethereum price từ CoinGecko
export const fetchETHPrice = async () => {
	try {
		const response = await fetch(`${COINGECKO_API}/simple/price?ids=ethereum&vs_currencies=usd`);
		const data = await response.json();
		return data.ethereum.usd;
	} catch (error) {
		console.error('Error fetching ETH price:', error);
		return 2000; // Fallback price
	}
};

// Gas prices từ Etherscan
export const fetchGasPrices = async () => {
	try {
		// Sử dụng public API key hoặc để trống cho rate limit thấp
		const apiKey = process.env.VITE_ETHERSCAN_API_KEY || '';
		const response = await fetch(
			`${ETHERSCAN_API}?module=gastracker&action=gasoracle&apikey=${apiKey}`
		);
		const data = await response.json();

		if (data.status === '1') {
			return {
				slow: { fee: parseInt(data.result.SafeGasPrice), time: '5+ phút' },
				standard: { fee: parseInt(data.result.ProposeGasPrice), time: '3 phút' },
				fast: { fee: parseInt(data.result.FastGasPrice), time: '< 2 phút' }
			};
		}
		throw new Error('API Error');
	} catch (error) {
		console.error('Error fetching gas prices:', error);
		// Fallback to reasonable estimates
		return {
			slow: { fee: 20, time: '5+ phút' },
			standard: { fee: 30, time: '3 phút' },
			fast: { fee: 45, time: '< 2 phút' }
		};
	}
};

// Network stats từ Etherscan
export const fetchNetworkStats = async () => {
	try {
		const apiKey = process.env.VITE_ETHERSCAN_API_KEY || '';
		const response = await fetch(
			`${ETHERSCAN_API}?module=stats&action=ethsupply&apikey=${apiKey}`
		);
		const data = await response.json();

		if (data.status === '1') {
			const supply = parseInt(data.result) / 1e18; // Convert from wei
			return {
				totalSupply: supply,
				lastBlock: Date.now() // Simplified
			};
		}
		throw new Error('API Error');
	} catch (error) {
		console.error('Error fetching network stats:', error);
		return {
			totalSupply: 120000000, // Approximate ETH supply
			lastBlock: Date.now()
		};
	}
};

// Market data từ CoinGecko
export const fetchMarketData = async () => {
	try {
		const response = await fetch(
			`${COINGECKO_API}/coins/ethereum?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
		);
		const data = await response.json();

		return {
			price: data.market_data.current_price.usd,
			change24h: data.market_data.price_change_percentage_24h,
			marketCap: data.market_data.market_cap.usd,
			volume24h: data.market_data.total_volume.usd,
			high24h: data.market_data.high_24h.usd,
			low24h: data.market_data.low_24h.usd
		};
	} catch (error) {
		console.error('Error fetching market data:', error);
		return {
			price: 2000,
			change24h: 0,
			marketCap: 240000000000,
			volume24h: 10000000000,
			high24h: 2100,
			low24h: 1900
		};
	}
};

// Real-time gas tracker từ multiple sources
export const fetchRealTimeGas = async () => {
	try {
		// Sử dụng ETH Gas Station API (free tier)
		const response = await fetch('https://ethgasstation.info/api/ethgasAPI.json');
		const data = await response.json();

		return {
			slow: {
				fee: Math.round(data.safeLow / 10), // Convert from gwei*10 to gwei
				time: '10+ phút',
				usd: ((data.safeLow / 10) * 21000 * 2000) / 1e9 // Rough USD estimate
			},
			standard: {
				fee: Math.round(data.standard / 10),
				time: '3-5 phút',
				usd: ((data.standard / 10) * 21000 * 2000) / 1e9
			},
			fast: {
				fee: Math.round(data.fast / 10),
				time: '< 2 phút',
				usd: ((data.fast / 10) * 21000 * 2000) / 1e9
			},
			fastest: {
				fee: Math.round(data.fastest / 10),
				time: '< 30 giây',
				usd: ((data.fastest / 10) * 21000 * 2000) / 1e9
			}
		};
	} catch (error) {
		console.error('Error fetching real-time gas:', error);
		// Fallback to Etherscan data
		return fetchGasPrices();
	}
};

// DeFi protocols data (for advanced features)
export const fetchDeFiData = async () => {
	try {
		const response = await fetch('https://api.llama.fi/protocols');
		const data = await response.json();

		// Filter for Ethereum protocols
		const ethProtocols = data
			.filter(protocol => protocol.chains?.includes('Ethereum'))
			.sort((a, b) => b.tvl - a.tvl)
			.slice(0, 10);

		return ethProtocols.map(protocol => ({
			name: protocol.name,
			tvl: protocol.tvl,
			change24h: protocol.change_1d || 0,
			category: protocol.category
		}));
	} catch (error) {
		console.error('Error fetching DeFi data:', error);
		return [];
	}
};

// Helper function để format currency
export const formatCurrency = (amount: number, currency = 'USD') => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
};

// Helper function để format large numbers
export const formatLargeNumber = (num: number) => {
	if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
	if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
	if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
	return num.toFixed(2);
}; 