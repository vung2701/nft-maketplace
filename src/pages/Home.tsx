import { useEffect, useState } from 'react';
import { NFTItem } from '../types';
import { Row, Col, message } from 'antd';
import { useAccount, usePublicClient, useReadContract } from 'wagmi';
import NFTCollection from '../abis/NFTCollection.json';
import axios from 'axios';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MintForm } from '../components/MintForm';
import { NFTCard } from '../components/NFTCard';

const convertIpfsToHttp = (ipfsUrl: string) => {
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return ipfsUrl;
};

export const Home: React.FC = () => {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const { data: balance } = useReadContract({
    address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: NFTCollection,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address && isConnected }
  });

  const fetchUserNFTs = async () => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');
    if (!balance) return;

    try {
      setLoading(true);
      const nftItems: NFTItem[] = [];

      // Get the current token counter (total minted NFTs)
      const tokenCounter = await publicClient.readContract({
        address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFTCollection,
        functionName: 'tokenCounter',
        args: []
      });

      let foundNFTs = 0;
      const totalTokens = Number(tokenCounter);

      // Check each token ID from 0 to tokenCounter-1
      for (let tokenId = 0; tokenId < totalTokens && foundNFTs < Number(balance); tokenId++) {
        try {
          // Check if the connected address is the owner of this token
          const tokenOwner = await publicClient.readContract({
            address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
            abi: NFTCollection,
            functionName: 'ownerOf',
            args: [BigInt(tokenId)]
          });

          // If this token belongs to the current user
          if (tokenOwner.toLowerCase() === address.toLowerCase()) {
            foundNFTs++;

            // Get token URI
            const tokenURI = await publicClient.readContract({
              address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
              abi: NFTCollection,
              functionName: 'tokenURI',
              args: [BigInt(tokenId)]
            });

            // Convert IPFS URI to HTTP
            const httpTokenURI = convertIpfsToHttp(tokenURI as string);

            // Fetch metadata
            const response = await axios.get(httpTokenURI);
            const metadata = response.data;

            const imageUrl = convertIpfsToHttp(metadata.image);

            nftItems.push({
              tokenId: tokenId,
              name: metadata.name,
              description: metadata.description,
              image: imageUrl,
              owner: address,
              isListed: false
            });
          }
        } catch (error) {
          // Skip invalid token IDs (might be burned tokens)
          console.log(`Skipping token ID ${tokenId}:`, error);
        }

        // If we've found all the user's NFTs, we can break the loop
        if (foundNFTs >= Number(balance)) {
          break;
        }
      }

      setNfts(nftItems);
      console.log('nft Items:', nftItems);
    } catch (err: any) {
      console.error('Lỗi khi tải NFT:', err);
      message.error(`Lỗi khi tải NFT: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && balance) {
      fetchUserNFTs();
    }
  }, [isConnected, balance]);

  return (
    <>
      <h2>Mint NFT</h2>
      <ConnectButton />
      <MintForm />
      <h2 style={{ marginTop: 40 }}>NFT của bạn</h2>
      {loading && <p>Đang tải...</p>}
      {!isConnected && <p>Vui lòng kết nối ví để xem NFT.</p>}
      <Row gutter={[16, 16]}>
        {nfts.map((nft) => (
          <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={6}>
            <NFTCard nft={nft} />
          </Col>
        ))}
      </Row>
    </>
  );
};
