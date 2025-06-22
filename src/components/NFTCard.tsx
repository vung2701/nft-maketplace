import React from 'react';
import { Card, Tag, Avatar, Button, Typography, Row, Col } from 'antd';
import { EyeOutlined, StarOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { NFTItem } from '../types/nft';

const { Meta } = Card;
const { Text } = Typography;

interface NFTCardProps {
  nft: NFTItem;
  onBuy?: (nft: NFTItem) => void;
  onView?: (nft: NFTItem) => void;
}

// ES6 utility functions với arrow functions
const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const formatPrice = (price: string) => `${price} ETH`;

export const NFTCard: React.FC<NFTCardProps> = ({ nft, onBuy, onView }) => {
  // Parse metadata để lấy rarity nếu có
  const metadata = typeof nft.metadata === 'string' ? JSON.parse(nft.metadata || '{}') : nft.metadata || {};
  const rarity = metadata.rarity;
  const attributes = metadata.attributes || [];

  // ES6 find method để lấy specific attributes
  const rarityAttr = attributes.find(attr => attr.trait_type === 'Rarity');

  return (
    <Card
      hoverable
      style={{ width: 300, margin: 16 }}
      cover={
        <div style={{ position: 'relative' }}>
          <img 
            alt={nft.name} 
            src={nft.image} 
            style={{ width: '100%', height: 200, objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.src = '/placeholder-nft.png';
            }}
          />
          
          {/* Rarity badge */}
          {(rarity || rarityAttr) && (
            <Tag 
              color={rarity?.color || '#1890ff'} 
              style={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                fontSize: 12,
                fontWeight: 'bold'
              }}
            >
              <StarOutlined /> {rarity?.tier || rarityAttr?.value}
            </Tag>
          )}
        </div>
      }
      actions={[
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          onClick={() => onView?.(nft)}
          key="view"
        >
          Xem chi tiết
        </Button>,
        ...(nft.isListed ? [{
          key: 'buy',
          component: (
            <Button 
              type="primary" 
              icon={<ShoppingCartOutlined />} 
              onClick={() => onBuy?.(nft)}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Mua {formatPrice(nft.price || '0')}
            </Button>
          )
        }] : [])
      ].map(action => typeof action === 'object' && 'component' in action ? action.component : action)}
    >
      <Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={nft.name}
        description={
          <div>
            <Text ellipsis style={{ display: 'block', marginBottom: 8 }}>
              {nft.description}
            </Text>
            
            {/* Rarity info */}
            {(rarity || rarityAttr) && (
              <Row gutter={8} style={{ marginBottom: 8 }}>
                <Col>
                  <Text style={{ fontSize: 12, color: '#666' }}>
                    <StarOutlined /> {rarity?.score || 'N/A'}/10000
                  </Text>
                </Col>
              </Row>
            )}
            
            <Text code style={{ fontSize: 11 }}>
              {formatAddress(nft.owner)}
            </Text>
            {nft.isListed && (
              <>
                <br />
                <Text strong style={{ color: '#52c41a' }}>
                  {formatPrice(nft.price || '0')}
                </Text>
              </>
            )}
          </div>
        }
      />
    </Card>
  );
};
