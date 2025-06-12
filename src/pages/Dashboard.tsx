import React from 'react';
import { Tabs, Typography, Space } from 'antd';
import { DatabaseOutlined, BarChartOutlined, TrophyOutlined, HistoryOutlined } from '@ant-design/icons';
import MarketplaceStats from '../components/graphComponents/MarketplaceStats';
import UserRanking from '../components/graphComponents/UserRanking';
import TransactionHistory from '../components/graphComponents/TransactionHistory';
import GraphStatus from '../components/graphComponents/GraphStatus';

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
          <TrophyOutlined />
          Xếp hạng
        </span>
      ),
      children: <UserRanking />
    },
    {
      key: '3',
      label: (
        <span>
          <HistoryOutlined />
          Lịch sử giao dịch
        </span>
      ),
      children: <TransactionHistory />
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={1}>
            <DatabaseOutlined />
            Dashboard NFT Marketplace
          </Title>
          <Paragraph style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
            📡 Thống kê thời gian thực từ The Graph Protocol
          </Paragraph>
        </div>

        <Tabs defaultActiveKey="1" size="large" items={tabItems} />
      </Space>
      
      {/* Real-time status indicator */}
      <GraphStatus />
    </div>
  );
};

export default Dashboard;
