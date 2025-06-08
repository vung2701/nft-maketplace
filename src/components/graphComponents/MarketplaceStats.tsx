import React from 'react';
import { Card, Row, Col, Statistic, Spin, Alert } from 'antd';
import {
  ShoppingCartOutlined,
  PictureOutlined,
  DollarOutlined,
  TrophyOutlined,
  FireOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useMarketplaceStats, formatVolume, formatTimeAgo } from '../../hooks/useGraphQL';

const MarketplaceStats: React.FC = () => {
  const { data, isLoading, error } = useMarketplaceStats();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="🛠️ Chức năng thống kê đang hoàn thiện"
        description="Chức năng thống kê marketplace đang được phát triển. Vui lòng chờ đợi!"
        type="warning"
        showIcon
      />
    );
  }

  const stats = (data as any)?.marketplaceStats?.[0];

  if (!stats) {
    return (
      <Alert
        message="📊 Chưa có dữ liệu thống kê"
        description="Marketplace chưa có hoạt động nào được ghi nhận. Hãy thử list hoặc mua NFT để xem thống kê!"
        type="info"
        showIcon
      />
    );
  }

  // Convert BigInt strings to numbers for display
  const totalListings = parseInt(stats.totalListings);
  const totalSales = parseInt(stats.totalSales);
  const totalActiveListings = parseInt(stats.totalActiveListings);
  const totalUsers = parseInt(stats.totalUsers);
  const totalCollections = parseInt(stats.totalCollections);

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
            <Statistic title="Đã bán" value={totalSales} prefix={<FireOutlined />} valueStyle={{ color: '#722ed1' }} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title="Tổng Users"
              value={totalUsers}
              prefix={<UserOutlined />}
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
              value={formatVolume(stats.totalVolume)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Giá trung bình"
              value={formatVolume(stats.averagePrice)}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Tỷ lệ bán"
              value={totalListings > 0 ? `${((totalSales / totalListings) * 100).toFixed(1)}%` : '0%'}
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
              <small>Cập nhật lần cuối: {formatTimeAgo(stats.updatedAt)}</small>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarketplaceStats;
