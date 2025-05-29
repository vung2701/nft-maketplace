import React from 'react';
import { Card, Row, Col, Statistic, Spin, Alert } from 'antd';
import { ShoppingCartOutlined, PictureOutlined, DollarOutlined, TrophyOutlined } from '@ant-design/icons';
import { useMarketplaceStats, formatPrice } from '../hooks/useGraphQL';

const MarketplaceStats: React.FC = () => {
  const { loading, error, data } = useMarketplaceStats();

  if (loading) return <Spin size="large" />;
  
  if (error) return (
    <Alert
      message="Lỗi tải thống kê"
      description={error.message}
      type="error"
      showIcon
    />
  );

  const nfts = data?.nfts || [];
  const sales = data?.sales || [];

  // Tính toán thống kê
  const totalNFTs = nfts.length;
  const listedNFTs = nfts.filter((nft: any) => nft.isListed).length;
  const totalSales = sales.length;
  
  const totalVolume = sales.reduce((sum: number, sale: any) => {
    return sum + formatPrice(sale.price);
  }, 0);

  const averagePrice = totalSales > 0 ? totalVolume / totalSales : 0;

  const floorPrice = nfts
    .filter((nft: any) => nft.isListed && nft.price !== "0")
    .reduce((min: number, nft: any) => {
      const price = formatPrice(nft.price);
      return price < min ? price : min;
    }, Infinity);

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số NFT"
              value={totalNFTs}
              prefix={<PictureOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="NFT đang bán"
              value={listedNFTs}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng giao dịch"
              value={totalSales}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng volume"
              value={totalVolume.toFixed(2)}
              suffix="ETH"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Giá trung bình"
              value={averagePrice.toFixed(4)}
              suffix="ETH"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Floor Price"
              value={floorPrice !== Infinity ? floorPrice.toFixed(4) : '0'}
              suffix="ETH"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarketplaceStats; 