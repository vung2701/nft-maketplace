import { useEffect, useState } from 'react';
import { NFTItem } from '../types';
import { Row, Col, message, Spin, Divider } from 'antd';
import { useAccount, usePublicClient, useReadContract, useWriteContract } from 'wagmi';
import MarketPlace from '../abis/Marketplace.json';
import NFTCollection from '../abis/NFTCollection.json';
import axios from 'axios';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NFTCard } from '../components/NFTCard';
import { parseEther } from 'viem';

const convertIpfsToHttp = (ipfsUrl: string) =>
  ipfsUrl.startsWith('ipfs://') ? ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/') : ipfsUrl;

export const Marketplace: React.FC = () => {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const { data: listings, refetch: refetchListings } = useReadContract({
    address: import.meta.env.VITE_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: MarketPlace,
    functionName: 'getListings',
    query: { enabled: isConnected }
  });

  const fetchNFTs = async () => {
    if (!isConnected || !address || !listings) {
      setNfts([]);
      return;
    }

    try {
      setLoading(true);
      const nftItems: NFTItem[] = [];
      for (const listing of listings as any[]) {
        if (listing.isSold || listing.seller === '0x0000000000000000000000000000000000000000') continue;

        try {
          const tokenURI = await publicClient.readContract({
            address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
            abi: NFTCollection,
            functionName: 'tokenURI',
            args: [listing.tokenId]
          });
          const {
            data: { name, description, image }
          } = await axios.get(convertIpfsToHttp(tokenURI as string));

          nftItems.push({
            tokenId: Number(listing.tokenId),
            name,
            description,
            image: convertIpfsToHttp(image),
            owner: listing.seller,
            price: (Number(listing.price) / 1e18).toString(),
            isListed: true
          });
        } catch (error) {
          console.log(`Skipping token ID ${listing.tokenId}:`, error);
        }
      }
      setNfts(nftItems);
    } catch (err: any) {
      message.error(`Lỗi khi tải NFT: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (tokenId: number, price: string) => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');
    if (nfts.find((nft) => nft.tokenId === tokenId)?.owner.toLowerCase() === address.toLowerCase()) {
      return message.error('Không thể mua NFT của chính bạn!');
    }

    try {
      setLoading(true);
      message.loading('Đang mua NFT...');
      const tx = await writeContractAsync({
        address: import.meta.env.VITE_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: MarketPlace,
        functionName: 'buyNFT',
        args: [import.meta.env.VITE_NFT_CONTRACT_ADDRESS, BigInt(tokenId)],
        value: parseEther(price)
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });

      message.success('Mua NFT thành công 🎉');
      await fetchNFTs();
      await refetchListings();
    } catch (err: any) {
      message.error(`Lỗi khi mua NFT: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && listings) fetchNFTs();
  }, [isConnected, listings]);

  return (
    <div className="marketplace">
      <h2>Marketplace</h2>
      <div className="connectButton">
        <ConnectButton />
      </div>
      {loading && <Spin />}
      {!isConnected && <p>Vui lòng kết nối ví để xem NFT.</p>}
      {isConnected && nfts.length === 0 && !loading && <p>Không có NFT nào được liệt kê.</p>}
      {nfts.length > 0 && (
        <>
          <Divider style={{ borderColor: '#bbb', margin: '30px 0', fontSize: 22 }}>Danh sách NFT</Divider>
          <Row gutter={[16, 16]}>
            {nfts.map((nft) => (
              <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={6}>
                <NFTCard nft={nft} onBuy={() => handleBuy(nft.tokenId, nft.price!)} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};
