import { MintForm } from '../components/MintForm.tsx';
import { NFTItem } from '../types';
import { NFTCard } from '../components/NFTCard';
import { Row, Col } from 'antd';
import { useState } from 'react';

export const Home: React.FC = () => {
  const [nfts, setNfts] = useState<NFTItem[]>([]);

  const handleMint = (data: { name: string; description: string; image: File }) => {
    // Giả lập NFT đã mint
    const newNft: NFTItem = {
      tokenId: Date.now(),
      name: data.name,
      description: data.description,
      image: URL.createObjectURL(data.image),
      owner: 'You'
    };
    setNfts([...nfts, newNft]);
  };

  return (
    <>
      <h2>Mint NFT</h2>
      <MintForm onMint={handleMint} />
      <h2 style={{ marginTop: 40 }}>NFT của bạn</h2>
      <Row gutter={[16, 16]}>
        {nfts.map((nft) => (
          <Col key={nft.tokenId}>
            <NFTCard nft={nft} />
          </Col>
        ))}
      </Row>
    </>
  );
};
