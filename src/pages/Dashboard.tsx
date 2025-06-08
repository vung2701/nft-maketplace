import React from 'react';
import { Tabs, Typography, Space, Alert } from 'antd';
import { DatabaseOutlined, BarChartOutlined, ShopOutlined } from '@ant-design/icons';
import MarketplaceStats from '../components/graphComponents/MarketplaceStats';
import TheGraphNFTList from '../components/graphComponents/TheGraphNFTList';

const { Title, Paragraph, Text } = Typography;

const Dashboard = () => {
  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <BarChartOutlined />
          Thống kê
        </span>
      ),
      children: <MarketplaceStats />
    },
    {
      key: '2',
      label: (
        <span>
          <DatabaseOutlined />
          Tài liệu
        </span>
      ),
      children: (
        <div style={{ padding: '20px' }}>
          <Title level={3}>🚀 The Graph Integration</Title>

          <Alert
            message="✅ Subgraph đã được cập nhật thành công!"
            description="Frontend đã được đồng bộ với schema mới của subgraph"
            type="success"
            showIcon
            style={{ marginBottom: '20px' }}
          />

          <Title level={4}>🎯 Chức năng chính:</Title>
          <ul>
            <li>
              <Text strong>NFT Listings:</Text> Hiển thị danh sách NFT đang được bán
            </li>
            <li>
              <Text strong>Marketplace Stats:</Text> Thống kê tổng quan marketplace
            </li>
            <li>
              <Text strong>Real-time data:</Text> Dữ liệu cập nhật tự động từ blockchain
            </li>
            <li>
              <Text strong>Purchase History:</Text> Lịch sử giao dịch mua bán
            </li>
          </ul>

          <Title level={4}>📊 Entities trong subgraph:</Title>
          <ul>
            <li>
              <Text code>Listing</Text> - Thông tin NFT listing
            </li>
            <li>
              <Text code>Purchase</Text> - Giao dịch mua bán
            </li>
            <li>
              <Text code>User</Text> - Thống kê user
            </li>
            <li>
              <Text code>Collection</Text> - Thống kê collection
            </li>
            <li>
              <Text code>MarketplaceStat</Text> - Thống kê tổng quan
            </li>
          </ul>

          <Title level={4}>🔧 Cách sử dụng:</Title>
          <Paragraph>
            <Text code>
              import &#123; useActiveListings, useMarketplaceStats &#125; from '../hooks/useGraphQL'
              <br />
              const &#123; data, isLoading, error &#125; = useActiveListings(12, 0)
            </Text>
          </Paragraph>

          <Title level={4}>📈 Metrics được tracking:</Title>
          <ul>
            <li>Tổng số listings và active listings</li>
            <li>Tổng volume và giá trung bình</li>
            <li>Số lượng users và collections</li>
            <li>Tỷ lệ bán thành công</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={1}>
            <DatabaseOutlined />
            Dashboard - NFT Marketplace
          </Title>
        </div>

        <Tabs defaultActiveKey="1" size="large" items={tabItems} />
      </Space>
    </div>
  );
};

export default Dashboard;
