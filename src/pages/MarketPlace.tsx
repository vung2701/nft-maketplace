import { NFTCard } from '../components/NFTCard';
import { NFTItem } from '../types';
import { Row, Col } from 'antd';

const mockNfts: NFTItem[] = [
  {
    tokenId: 1,
    name: 'Crypto Cat',
    description: 'Một con mèo siêu cute',
    image: 'https://placekitten.com/300/300',
    owner: '0x123...abc',
    price: '0.05',
    isListed: true
  },
  {
    tokenId: 2,
    name: 'Space Ape',
    description: 'NFT ngoài vũ trụ',
    image: 'https://placebear.com/300/300',
    owner: '0x456...def',
    price: '0.08',
    isListed: true
  }
];

export const Marketplace: React.FC = () => {
  return (
    <>
      <h2>Marketplace</h2>
      <Row gutter={[16, 16]}>
        {mockNfts.map((nft) => (
          <Col key={nft.tokenId}>
            <NFTCard nft={nft} onBuy={() => alert(`Mua NFT #${nft.tokenId}`)} />
          </Col>
        ))}
      </Row>
    </>
  );
};
