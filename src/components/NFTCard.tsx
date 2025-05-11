import { Card, Button, Typography } from 'antd';
import { NFTItem } from '../types';

interface Props {
  nft: NFTItem;
  onBuy?: () => void;
  onList?: () => void;
}

export const NFTCard = ({ nft, onBuy, onList }: Props) => {
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
            height: '200px' // Điều chỉnh kích thước hình ảnh
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
          <Typography.Paragraph ellipsis={{ rows: 2, expandable: true }}>{nft.description}</Typography.Paragraph>
        }
      />
      <div style={{ marginTop: 10 }}>
        <p style={{ fontSize: '14px', color: '#555' }}>Owner: {nft.owner}</p>
        {nft.isListed && (
          <p style={{ fontSize: '14px', color: '#555' }}>
            Price: <span style={{ fontWeight: 'bold' }}>{nft.price} ETH</span>
          </p>
        )}
        {onBuy && (
          <Button type="primary" block onClick={onBuy} style={{ marginBottom: 8 }}>
            Buy
          </Button>
        )}
        {onList && (
          <Button block onClick={onList}>
            List
          </Button>
        )}
      </div>
    </Card>
  );
};
