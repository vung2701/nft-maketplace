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
      cover={<img alt={nft.name} src={nft.image} style={{ height: 240, objectFit: 'cover' }} />}
      actions={[
        onBuy && (
          <div style={{ padding: '0 16px 16px' }}>
            <Button key="buy" type="primary" onClick={onBuy} style={{ width: '100%' }}>
              Mua
            </Button>
          </div>
        ),
        onList && (
          <div style={{ padding: '0 16px 16px', width: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input
                placeholder="Giá (ETH)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onPressEnter={() => onList(price)}
                style={{ width: '100%' }}
              />
              <Button type="primary" onClick={() => onList(price)} style={{ width: '100%' }}>
                List vào Marketplace
              </Button>
            </Space>
          </div>
        )
      ].filter(Boolean)}
    >
      <Card.Meta className="tft" title={nft.name} description={nft.description} />
      {showStatus && customAction}
    </Card>
  );
};
