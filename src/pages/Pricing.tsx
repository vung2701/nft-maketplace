import React from 'react';
import { Typography, Space, Divider } from 'antd';
import { DynamicPricing } from '../components/chainlinkComponents/DynamicPricing';

const { Title, Paragraph } = Typography;

export const Pricing: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={1}>📊 Real-time Pricing & Gas Tracker</Title>
          <Paragraph style={{ fontSize: 16, color: '#666' }}>
            Theo dõi giá ETH real-time và ước tính gas fees từ Chainlink Oracle
          </Paragraph>
        </div>

        <Divider />

        <DynamicPricing />
      </Space>
    </div>
  );
};

export default Pricing;
