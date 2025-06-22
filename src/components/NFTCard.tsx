import React, { useState } from 'react';
import { Card, Button, Input, Space, Tag } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { NFTItem } from '../types';
import { DEFAULT_VALUES, COLORS, RARITY_TIERS } from '../constants';
import { IPFSImage } from './moralisComponents/IPFSImage';
import { fixPinataUrl } from '../utils/web3';

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

  // Lấy thông tin rarity tier
  const getRarityTierInfo = (tier: string) => {
    const tierInfo = Object.values(RARITY_TIERS).find(t => t.name === tier);
    return tierInfo || RARITY_TIERS.COMMON;
  };

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
        <div style={{ position: 'relative' }}>
          <IPFSImage
            alt={nft.name}
            src={fixPinataUrl(nft.image)}
            style={{
              height: DEFAULT_VALUES.IMAGE_HEIGHT,
              objectFit: 'cover',
              width: '100%'
            }}
            preview={false}
          />
          {/* Hiển thị rarity badge */}
          {nft.rarity && nft.rarity.isVerified && (
            <Tag
              color={getRarityTierInfo(nft.rarity.rarityTier).color}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                margin: 0,
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            >
              <StarOutlined /> {nft.rarity.rarityTier}
            </Tag>
          )}
        </div>
      }
      actions={getCardActions().map((action) => action.content)}
    >
      <Card.Meta 
        title={nft.name} 
        description={
          <div>
            <div>{nft.description}</div>
            {/* Hiển thị rarity score */}
            {nft.rarity && nft.rarity.isVerified && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: getRarityTierInfo(nft.rarity.rarityTier).color }}>
                Rarity Score: {nft.rarity.rarityScore}/10000
              </div>
            )}
          </div>
        } 
      />
      {showStatus && customAction}
    </Card>
  );
};
