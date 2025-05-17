import React from 'react';
import { Card, Button, Input, Space } from 'antd';
import { NFTItem } from '../types';

interface NFTCardProps {
  nft: NFTItem;
  showStatus?: boolean;
  customAction?: React.ReactNode;
  onBuy?: () => void;
  onList?: (price: string) => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, showStatus, customAction, onBuy, onList }) => {
  const [price, setPrice] = React.useState('');

  return (
    <Card
      cover={<img alt={nft.name} src={nft.image} style={{ height: 200, objectFit: 'cover' }} />}
      actions={[
        onBuy && (
          <Button key="buy" type="primary" onClick={onBuy}>
            Mua
          </Button>
        ),
        onList && (
          <Space key="list" direction="horizontal" size="small">
            <Input
              placeholder="Giá (ETH)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onPressEnter={() => onList(price)} // Keep Enter key support
              style={{ width: 100 }}
            />
            <Button type="primary" onClick={() => onList(price)}>
              Liệt kê
            </Button>
          </Space>
        )
      ].filter(Boolean)}
    >
      <Card.Meta title={nft.name} description={nft.description} />
      {showStatus && customAction}
    </Card>
  );
};
