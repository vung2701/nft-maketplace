import { Card, Button, Typography, Input, message } from 'antd';
import { NFTItem } from '../types';
import { useState } from 'react';

interface Props {
  nft: NFTItem;
  onBuy?: () => void;
  onList?: (price: string) => void;
}

export const NFTCard = ({ nft, onBuy, onList }: Props) => {
  const [listPrice, setListPrice] = useState('');

  const handleList = () => {
    if (!listPrice || isNaN(Number(listPrice)) || Number(listPrice) <= 0) {
      return message.error('Nhập giá hợp lệ (ETH)!');
    }
    onList?.(listPrice);
  };

  return (
    <Card
      hoverable
      cover={<img alt={nft.name} src={nft.image} style={{ objectFit: 'cover', width: '100%', height: 230 }} />}
      style={{ width: 300, borderRadius: 8, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
    >
      <Card.Meta
        title={<Typography.Title level={5}>{nft.name}</Typography.Title>}
        description={
          <Typography.Paragraph ellipsis={{ rows: 1, expandable: true }}>{nft.description}</Typography.Paragraph>
        }
      />
      <div style={{ marginTop: 10 }}>
        <p style={{ fontSize: 14, color: '#555', wordBreak: 'break-word' }}>
          <b>Owner:</b> {nft.owner}
        </p>
        {nft.isListed && nft.price && (
          <p style={{ fontSize: 14, color: '#555' }}>
            Giá: <b>{nft.price} ETH</b>
          </p>
        )}
        {onBuy && nft.isListed && (
          <Button type="primary" block onClick={onBuy} style={{ marginBottom: 8 }}>
            Mua
          </Button>
        )}
        {onList && !nft.isListed && (
          <>
            <Input
              placeholder="Giá (ETH)"
              value={listPrice}
              onChange={(e) => setListPrice(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <Button block onClick={handleList}>
              Liệt kê
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
