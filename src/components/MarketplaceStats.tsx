import React from 'react';
import { Card, Row, Col, Statistic, Spin, Alert } from 'antd';
import { ShoppingCartOutlined, PictureOutlined, DollarOutlined, TrophyOutlined, FireOutlined, BarChartOutlined } from '@ant-design/icons';
import { useMarketplaceStats, formatPrice, formatDate } from '../hooks/useGraphQL';

interface MarketplaceStat {
  id: string;
  totalListings: string;
  totalSales: string;
  totalVolume: string;
  totalActiveListings: string;
  averagePrice: string;
  updatedAt: string;
}

const MarketplaceStats: React.FC = () => {
  const { data, isLoading, isError, error } = useMarketplaceStats();

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" />
    </div>
  );

  if (isError) {
    console.log('The Graph Marketplace Stats Error:', error?.message);

    return (
      <Alert
        message="🛠️ Chức năng thống kê đang hoàn thiện"
        description="Chức năng thống kê marketplace đang được phát triển. Vui lòng chờ đợi!"
        type="warning"
        showIcon
      />
    );
  }

  const marketplaceStats = (data as { marketplaceStats: MarketplaceStat[] })?.marketplaceStats;
  
  // If no stats exist yet (subgraph hasn't indexed any data)
  if (!marketplaceStats || marketplaceStats.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="📊 Chưa có dữ liệu thống kê"
          description="Marketplace chưa có hoạt động nào được ghi nhận. Hãy thử list hoặc mua NFT để xem thống kê!"
          type="info"
          showIcon
        />
      </div>
    );
  }

  const stats = marketplaceStats[0];

  // Convert BigInt strings to numbers for display
  const totalListings = parseInt(stats.totalListings);
  const totalSales = parseInt(stats.totalSales);
  const totalActiveListings = parseInt(stats.totalActiveListings);
  const totalVolume = formatPrice(stats.totalVolume);
  const averagePrice = formatPrice(stats.averagePrice);
  const lastUpdated = formatDate(stats.updatedAt);

  // Calculate derived stats
  const soldListings = totalListings - totalActiveListings;
  const salesRate = totalListings > 0 ? (soldListings / totalListings * 100).toFixed(1) : '0';

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Tổng số Listings"
              value={totalListings}
              prefix={<PictureOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Đang bán"
              value={totalActiveListings}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Đã bán"
              value={soldListings}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Tổng giao dịch"
              value={totalSales}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tổng volume"
              value={totalVolume.toFixed(4)}
              suffix="ETH"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Giá trung bình"
              value={averagePrice > 0 ? averagePrice.toFixed(4) : '0'}
              suffix="ETH"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tỷ lệ bán"
              value={salesRate}
              suffix="%"
              prefix={<FireOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card>
            <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
              <small>Cập nhật lần cuối: {lastUpdated}</small>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarketplaceStats;
