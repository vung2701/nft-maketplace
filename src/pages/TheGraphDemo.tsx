import React from 'react';
import { Tabs, Typography, Space, Alert } from 'antd';
import { DatabaseOutlined, BarChartOutlined, ShopOutlined } from '@ant-design/icons';
import TheGraphNFTList from '../components/TheGraphNFTList';
import MarketplaceStats from '../components/MarketplaceStats';

const { Title, Paragraph, Text } = Typography;

const TheGraphDemo: React.FC = () => {
  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <ShopOutlined />
          NFT Marketplace
        </span>
      ),
      children: <TheGraphNFTList />
    },
    {
      key: '2',
      label: (
        <span>
          <BarChartOutlined />
          Thống kê
        </span>
      ),
      children: <MarketplaceStats />
    },
    {
      key: '3',
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
            <DatabaseOutlined /> The Graph NFT Marketplace
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            Tích hợp The Graph để truy vấn dữ liệu NFT marketplace từ blockchain
          </Paragraph>
        </div>

        <Alert
          message="🎉 Schema mới đã được áp dụng thành công!"
          description={
            <div>
              <Text strong>✅ Frontend đã được cập nhật với subgraph schema mới</Text>
              <br />
              <Text>📊 Marketplace Stats với metrics chi tiết từ blockchain</Text>
              <br />
              <Text>🔄 Dữ liệu real-time từ The Graph subgraph</Text>
            </div>
          }
          type="success"
          showIcon
          style={{ marginBottom: '20px' }}
        />

        <Tabs defaultActiveKey="1" size="large" items={tabItems} />
      </Space>
    </div>
  );
};

export default TheGraphDemo;

