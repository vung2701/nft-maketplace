import { useEffect, useState } from 'react';
import { NFTItem } from '../types';
import { Row, Col, message } from 'antd';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import MarketPlace from '../abis/Marketplace.json';
import NFTCollection from '../abis/NFTCollection.json';
import axios from 'axios';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NFTCard } from '../components/NFTCard';

export const Marketplace: React.FC = () => {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { data: listings, refetch: refetchListings } = useReadContract({
    address: import.meta.env.VITE_MARKETPLACE_ADDRESS as `0x${string}`,
    abi: Marketplace,
    functionName: 'getListings',
    query: { enabled: isConnected }
  });

  const fetchNFTs = async () => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');
    if (!listings) return;

    try {
      setLoading(true);
      const nftItems: NFTItem[] = [];

      for (const listing of listings as any[]) {
        if (!listing.isSold) {
          const { data: tokenURI } = await useReadContract({
            address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
            abi: NFTCollection,
            functionName: 'tokenURI',
            args: [listing.tokenId]
          });

          const response = await axios.get(tokenURI as string);
          const metadata = response.data;

          nftItems.push({
            tokenId: Number(listing.tokenId),
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            owner: listing.seller,
            price: (Number(listing.price) / 10 ** 18).toString(),
            isListed: true
          });
        }
      }

      setNfts(nftItems);
    } catch (err: any) {
      console.error(err);
      message.error(`Lỗi khi tải NFT: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (tokenId: number | string) => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');

    try {
      setLoading(true);
      message.loading('Đang mua NFT...');
      const listingId = nfts.findIndex((nft) => nft.tokenId === tokenId);
      const price = BigInt(Number(nfts[listingId].price!) * 10 ** 18);

      await writeContractAsync({
        address: import.meta.env.VITE_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: MarketPlace,
        functionName: 'buyNFT',
        args: [listingId],
        value: price
      });

      message.success('Mua NFT thành công 🎉');
      await refetchListings(); // Cập nhật danh sách NFT
    } catch (err: any) {
      console.error(err);
      message.error(`Mua NFT thất bại: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && listings) {
      fetchNFTs();
    }
  }, [isConnected, listings]);

  return (
    <div>
      <h2>Marketplace</h2>
      <ConnectButton />
      {loading && <p>Đang tải...</p>}
      {!isConnected && <p>Vui lòng kết nối ví để xem NFT.</p>}
      <Row gutter={[16, 16]}>
        {nfts.map((nft) => (
          <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={6}>
            <NFTCard nft={nft} onBuy={() => handleBuy(nft.tokenId)} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
