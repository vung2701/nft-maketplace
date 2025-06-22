// Test function cho Pinata URL fix
export const testPinataFix = () => {
	const badUrl = "https://api.pinata.cloud/QmZCwZVDhENW9ZfkDp7Qi5otg3wCkbDaMK22X8E7iYpNG1";

	console.log("🔧 Testing Pinata URL Fix:");
	console.log("Original:", badUrl);

	// Extract hash
	const parts = badUrl.split('api.pinata.cloud/');
	if (parts.length === 2) {
		const hash = parts[1];
		const ipfsUrl = `ipfs://${hash}`;
		const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${hash}`;

		console.log("Hash:", hash);
		console.log("Fixed IPFS:", ipfsUrl);
		console.log("Gateway URL:", gatewayUrl);

		return {
			original: badUrl,
			hash,
			ipfsUrl,
			gatewayUrl
		};
	}

	return null;
};

// Test ngay
if (typeof window !== 'undefined') {
	testPinataFix();
} 