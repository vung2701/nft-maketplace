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

          <Title level={4}>Tính năng đã tích hợp:</Title>
          <ul>
            <li>
              <Text strong>Real-time data:</Text> Dữ liệu NFT được cập nhật tự động từ blockchain
            </li>
            <li>
              <Text strong>Hiệu suất cao:</Text> Truy vấn nhanh mà không cần quét blockchain
            </li>
            <li>
              <Text strong>GraphQL API:</Text> Query linh hoạt với Apollo Client
            </li>
            <li>
              <Text strong>Pagination:</Text> Hỗ trợ phân trang cho danh sách lớn
            </li>
            <li>
              <Text strong>Thống kê:</Text> Tính toán metrics marketplace real-time
            </li>
          </ul>

          <Title level={4}>Components đã tạo:</Title>
          <ul>
            <li>
              <Text code>TheGraphNFTList</Text> - Hiển thị danh sách NFT
            </li>
            <li>
              <Text code>MarketplaceStats</Text> - Thống kê marketplace
            </li>
            <li>
              <Text code>useGraphQL hooks</Text> - Custom hooks để query dữ liệu
            </li>
            <li>
              <Text code>Apollo Client</Text> - Setup GraphQL client
            </li>
          </ul>

          <Title level={4}>Cách sử dụng:</Title>
          <Paragraph>
            <Text code>
              import &#123; useListedNFTs &#125; from '../hooks/useGraphQL'
              <br />
              const &#123; loading, error, data &#125; = useListedNFTs(12, 0)
            </Text>
          </Paragraph>

          <Title level={4}>Queries có sẵn:</Title>
          <ul>
            <li>
              <Text code>GET_ALL_NFTS</Text> - Lấy tất cả NFT
            </li>
            <li>
              <Text code>GET_LISTED_NFTS</Text> - NFT đang được bán
            </li>
            <li>
              <Text code>GET_USER_NFTS</Text> - NFT của user
            </li>
            <li>
              <Text code>GET_NFT_DETAIL</Text> - Chi tiết NFT
            </li>
            <li>
              <Text code>GET_SALES_HISTORY</Text> - Lịch sử giao dịch
            </li>
            <li>
              <Text code>GET_MARKETPLACE_STATS</Text> - Thống kê tổng quan
            </li>
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
            <DatabaseOutlined /> The Graph Integration Demo
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            Tích hợp The Graph vào NFT Marketplace để truy vấn dữ liệu blockchain hiệu quả
          </Paragraph>
        </div>

        {/* <Alert
          message="⚠️ Subgraph đã được cấu hình"
          description={
            <div>
              <Text strong>✅ URL subgraph đã được cập nhật thành công!</Text>
              <br />
              <Text>Nếu vẫn gặp lỗi kết nối, hãy đảm bảo:</Text>
              <br />
              • Smart contract đã emit đúng events (NFTMinted, NFTSold, Transfer)
              <br />
              • Subgraph đã sync hoàn tất trên The Graph Studio
              <br />• Có dữ liệu NFT trong contract để hiển thị
            </div>
          }
          type="success"
          showIcon
          style={{ marginBottom: '20px' }}
        /> */}

        <Tabs defaultActiveKey="1" size="large" items={tabItems} />
      </Space>
    </div>
  );
};

export default TheGraphDemo;
