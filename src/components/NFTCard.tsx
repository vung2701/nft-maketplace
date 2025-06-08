import React, { useState } from 'react';
import { Card, Button, Input, Space } from 'antd';
import { NFTItem } from '../types';
import { DEFAULT_VALUES, COLORS } from '../constants';

interface NFTCardProps {
  nft: NFTItem;
  showStatus?: boolean;
  customAction?: React.ReactNode;
  onBuy?: () => void;
  onList?: (price: string) => void;
}

interface CardAction {
  key: string;
  content: React.ReactNode;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, showStatus, customAction, onBuy, onList }) => {
  const [price, setPrice] = useState('');

  // Xử lý các actions của card
  const getCardActions = (): CardAction[] => {
    const actions: CardAction[] = [];

    if (onBuy) {
      actions.push({
        key: 'buy',
        content: (
          <div style={{ padding: '0 16px 16px' }}>
            <Button type="primary" onClick={onBuy} style={{ width: '100%' }}>
              Mua
            </Button>
          </div>
        )
      });
    }

    if (onList) {
      actions.push({
        key: 'list',
        content: (
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
      });
    }

    return actions;
  };

  return (
    <Card
      cover={
        <img
          alt={nft.name}
          src={nft.image}
          style={{
            height: DEFAULT_VALUES.IMAGE_HEIGHT,
            objectFit: 'cover'
          }}
        />
      }
      actions={getCardActions().map((action) => action.content)}
    >
      <Card.Meta title={nft.name} description={nft.description} />
      {showStatus && customAction}
    </Card>
  );
};
