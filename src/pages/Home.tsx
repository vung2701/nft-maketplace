import { useEffect, useState } from 'react';
import { NFTItem } from '../types';
import { Row, Col, message } from 'antd';
import { useAccount, useReadContract } from 'wagmi';
import NFTCollection from '../abis/NFTCollection.json';
import axios from 'axios';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MintForm } from '../components/MintForm';
import { NFTCard } from '../components/NFTCard';

export const Home: React.FC = () => {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();

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

      for (let i = 0; i < Number(balance); i++) {
        const { data: tokenId } = await useReadContract({
          address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
          abi: NFTCollection,
          functionName: 'tokenOfOwnerByIndex',
          args: [address, i]
        });

        const { data: tokenURI } = await useReadContract({
          address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
          abi: NFTCollection,
          functionName: 'tokenURI',
          args: [tokenId]
        });

        const response = await axios.get(tokenURI as string);
        const metadata = response.data;

        nftItems.push({
          tokenId: Number(tokenId),
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          owner: address,
          isListed: false
        });
      }

      setNfts(nftItems);
    } catch (err: any) {
      console.error(err);
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
