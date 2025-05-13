import { Card, Button, Typography, Input } from 'antd';
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
      alert('Vui lòng nhập giá hợp lệ (số lớn hơn 0)!');
      return;
    }
    if (onList) {
      onList(listPrice);
    }
  };
  return (
    <Card
      hoverable
      cover={
        <img
          alt={nft.name}
          src={nft.image}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '230px'
          }}
        />
      }
      style={{
        width: 300,
        borderRadius: '8px', // Cải thiện viền của card
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' // Thêm hiệu ứng bóng đổ
      }}
    >
      <Card.Meta
        title={
          <Typography.Title level={5} style={{ marginBottom: 10 }}>
            {nft.name}
          </Typography.Title>
        }
        description={
          <Typography.Paragraph ellipsis={{ rows: 1, expandable: true }}>{nft.description}</Typography.Paragraph>
        }
      />
      <div style={{ marginTop: 10 }}>
        <p
          style={{
            fontSize: '14px',
            color: '#555',
            wordBreak: 'break-word', // cho phép ngắt từ giữa nếu cần
            whiteSpace: 'normal', // cho phép xuống dòng
            maxWidth: '100%'
          }}
        >
          <b>Owner:</b> {nft.owner}
        </p>
        {nft.isListed && (
          <p style={{ fontSize: '14px', color: '#555' }}>
            Price: <span style={{ fontWeight: 'bold' }}>{nft.price} ETH</span>
          </p>
        )}
        {onBuy && nft.isListed && (
          <Button type="primary" block onClick={onBuy} style={{ marginBottom: 8 }}>
            Buy
          </Button>
        )}
        {!nft.isListed && onList && (
          <div style={{ marginTop: 8 }}>
            <Input
              placeholder="Nhập giá (ETH)"
              value={listPrice}
              onChange={(e) => setListPrice(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <Button block onClick={handleList}>
              List
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
