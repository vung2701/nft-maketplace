import React from 'react';
import { Typography, Space, Divider } from 'antd';
import { MintForm } from '../components/form/MintForm';

const { Title, Paragraph } = Typography;

export const MintNFT: React.FC = () => {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={1}>
            🎨 Tạo NFT Mới
          </Title>
          <Paragraph style={{ fontSize: 16, color: '#666' }}>
            Tạo NFT với độ hiếm được sinh tự động và lưu trên blockchain
          </Paragraph>
        </div>
        
        <Divider />
        
        <MintForm 
          onSuccess={() => {
            console.log('NFT đã được mint thành công với rarity tự động!');
          }}
        />
      </Space>
    </div>
  );
};
