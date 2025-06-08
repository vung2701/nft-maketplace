import React from 'react';
import { Layout, Typography, Divider } from 'antd';
import { MoralisNFTDemo } from '../components/MoralisNFTDemo';

const { Title, Paragraph } = Typography;

const MoralisDemo: React.FC = () => {
  return (
    <Layout.Content style={{ padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Title level={1}>
            🚀 Moralis Web3 API Demo
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            Trải nghiệm tích hợp Moralis để quản lý NFT metadata, real-time data và IPFS resolution
          </Paragraph>
        </div>

        <Divider />

        {/* Features Overview */}
        <div style={{ marginBottom: '30px' }}>
          <Title level={3}>✨ Tính năng Moralis đã tích hợp:</Title>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ 
              padding: '15px', 
              background: '#f6f8fa', 
              borderRadius: '8px',
              border: '1px solid #e1e4e8'
            }}>
              <h4>🖼️ NFT Metadata</h4>
              <p>Name, description, image, attributes tự động parse</p>
            </div>
            
            <div style={{ 
              padding: '15px', 
              background: '#f6f8fa', 
              borderRadius: '8px',
              border: '1px solid #e1e4e8'
            }}>
              <h4>🔄 IPFS Resolution</h4>
              <p>Tự động resolve IPFS URLs với multiple gateways</p>
            </div>
            
            <div style={{ 
              padding: '15px', 
              background: '#f6f8fa', 
              borderRadius: '8px',
              border: '1px solid #e1e4e8'
            }}>
              <h4>📱 Real-time Info</h4>
              <p>Current ownership, balance updates, collection data</p>
            </div>
            
            <div style={{ 
              padding: '15px', 
              background: '#f6f8fa', 
              borderRadius: '8px',
              border: '1px solid #e1e4e8'
            }}>
              <h4>🏷️ Smart Filtering</h4>
              <p>Verified collections, spam detection, attributes filter</p>
            </div>
          </div>
        </div>

        <Divider />

        {/* Main Demo Component */}
        <MoralisNFTDemo />
      </div>
    </Layout.Content>
  );
};

export default MoralisDemo; 