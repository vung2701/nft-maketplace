// Các hàm tiện ích cho web3
export const convertIpfsToHttp = (ipfsUrl: string): string => {
	if (!ipfsUrl) return '';
	return ipfsUrl.startsWith('ipfs://') ? ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/') : ipfsUrl;
};

export const shortenAddress = (address: string): string => {
	if (!address) return '';
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (wei: bigint): string => {
	return (Number(wei) / 1e18).toString();
};

export const parseWei = (ether: string): bigint => {
	return BigInt(Math.floor(Number(ether) * 1e18));
}; 