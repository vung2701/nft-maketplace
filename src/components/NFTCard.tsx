import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { IPFSImage } from './moralisComponents/IPFSImage';
import type { NFTItem } from '../types/nft';

const { Text, Title } = Typography;

interface NFTCardProps {
  nft: NFTItem;
  actions?: React.ReactNode[];
  onClick?: () => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft, actions, onClick }) => {
  const handleCardClick = () => {
    if (onClick) onClick();
  };

  return (
    <Card
      hoverable={!!onClick}
      onClick={handleCardClick}
      actions={actions}
      cover={
        <div style={{ height: 240, overflow: 'hidden' }}>
          <IPFSImage 
            src={nft.image} 
            alt={nft.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        </div>
      }
      style={{ width: '100%' }}
    >
      <Card.Meta
        title={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Title level={4} style={{ margin: 0, fontSize: 16 }}>
              {nft.name}
            </Title>
          </Space>
        }
        description={
          <Space direction="vertical" size="small">
            <Text type="secondary" ellipsis>
              {nft.description}
            </Text>
            
            {nft.price && (
              <Tag color="blue">
                💰 {nft.price} ETH
              </Tag>
            )}
            
            {nft.tokenId && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Token ID: {nft.tokenId}
              </Text>
            )}
          </Space>
        }
      />
    </Card>
  );
};
