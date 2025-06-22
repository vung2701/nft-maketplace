// Các hàm tiện ích cho web3
export const convertIpfsToHttp = (ipfsUrl: string): string => {
	if (!ipfsUrl) return '';
	return ipfsUrl.startsWith('ipfs://') ? ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/') : ipfsUrl;
};

// Fix URLs Pinata bị sai format
export const fixPinataUrl = (url: string): string => {
	if (!url) return '';

	// Nếu URL có format sai: https://api.pinata.cloud/QmXXX
	if (url.includes('api.pinata.cloud/') && !url.includes('/ipfs/')) {
		// Extract hash sau api.pinata.cloud/
		const parts = url.split('api.pinata.cloud/');
		if (parts.length === 2) {
			const hash = parts[1];
			// Convert sang format ipfs:// để hệ thống xử lý
			return `ipfs://${hash}`;
		}
	}

	return url;
};

export const shortenAddress = (address: string): string => {
	if (!address) return '';
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (wei: bigint): string => {
	return (Number(wei) / 1e18).toString();
};

// Parse Wei từ string sang số
export const parseWei = (weiString: string): number => {
	try {
		return parseFloat(weiString) / Math.pow(10, 18);
	} catch {
		return 0;
	}
}; 