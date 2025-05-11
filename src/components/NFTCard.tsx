import { Card, Button } from 'antd';
import { NFTItem } from '../types';

interface Props {
  nft: NFTItem;
  onBuy?: () => void;
  onList?: () => void;
}

export const NFTCard = ({ nft, onBuy, onList }: Props) => {
  return (
    <Card hoverable cover={<img alt={nft.name} src={nft.image} />} style={{ width: 300 }}>
      <Card.Meta title={nft.name} description={nft.description} />
      <p>Owner: {nft.owner}</p>
      {nft.isListed && <p>Price: {nft.price} ETH</p>}
      {onBuy && (
        <Button type="primary" onClick={onBuy}>
          Buy
        </Button>
      )}
      {onList && <Button onClick={onList}>List</Button>}
    </Card>
  );
};
