import React from 'react';
import { Tabs, Typography, Space, Alert, Card } from 'antd';
import { DatabaseOutlined, UserOutlined, SearchOutlined, SettingOutlined } from '@ant-design/icons';
import MoralisNFTList from '../components/MoralisNFTList';
import { MoralisProvider, MoralisStatus } from '../components/MoralisProvider';

const { Title, Paragraph, Text } = Typography;

const MoralisDemo: React.FC = () => {
  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined />
          NFT Explorer
        </span>
      ),
      children: <MoralisNFTList />
    },
    {
      key: '2',
      label: (
        <span>
          <SettingOutlined />
          Setup & Config
        </span>
      ),
      children: (
        <MoralisProvider showStatus={true}>
          <div />
        </MoralisProvider>
      )
    },
    {
      key: '3',
      label: (
        <span>
          <DatabaseOutlined />
          Documentation
        </span>
      ),
      children: (
        <div style={{ padding: '20px' }}>
          <Title level={3}>🔥 Moralis Integration Guide</Title>
          
          <Alert
            message="🚀 What is Moralis?"
            description="Moralis is a Web3 development platform that provides powerful APIs for blockchain data, authentication, and cross-chain functionality."
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
          />

          <Title level={4}>✨ Features Integrated:</Title>
          <Card style={{ marginBottom: '16px' }}>
            <ul>
              <li>
                <Text strong>NFT APIs:</Text> Get user NFTs, contract NFTs, metadata, transfers
              </li>
              <li>
                <Text strong>Multi-chain Support:</Text> Ethereum, Polygon, BSC, Avalanche
              </li>
              <li>
                <Text strong>Real-time Data:</Text> Up-to-date NFT ownership and metadata
              </li>
              <li>
                <Text strong>Search & Discovery:</Text> Explore NFTs by contract address
              </li>
              <li>
                <Text strong>Pagination:</Text> Efficient loading of large NFT collections
              </li>
              <li>
                <Text strong>Error Handling:</Text> Graceful fallbacks and retry logic
              </li>
            </ul>
          </Card>

          <Title level={4}>🏗️ Architecture:</Title>
          <Card style={{ marginBottom: '16px' }}>
            <Paragraph>
              <Text code>services/moralis/</Text> - Core Moralis API services
              <br />
              <Text code>hooks/useMoralis.ts</Text> - React hooks for data fetching
              <br />
              <Text code>components/MoralisProvider.tsx</Text> - Context and initialization
              <br />
              <Text code>components/MoralisNFTList.tsx</Text> - UI components
            </Paragraph>
          </Card>

          <Title level={4}>🔧 Setup Instructions:</Title>
          <Card style={{ marginBottom: '16px' }}>
            <ol>
              <li><Text strong>Create Moralis Account:</Text> Visit <a href="https://admin.moralis.io/" target="_blank" rel="noopener noreferrer">admin.moralis.io</a></li>
              <li><Text strong>Create Project:</Text> Set up a new Web3 API project</li>
              <li><Text strong>Get API Key:</Text> Copy your API key from the dashboard</li>
              <li><Text strong>Configure:</Text> Update the API key in <Text code>services/moralis/client.ts</Text></li>
              <li><Text strong>Restart:</Text> Restart your development server</li>
            </ol>
          </Card>

          <Title level={4}>💡 Best Practices:</Title>
          <Card style={{ marginBottom: '16px' }}>
            <ul>
              <li><Text strong>API Key Security:</Text> Never expose API keys in client-side code</li>
              <li><Text strong>Rate Limiting:</Text> Implement proper caching and request throttling</li>
              <li><Text strong>Error Handling:</Text> Always handle API failures gracefully</li>
              <li><Text strong>Chain Support:</Text> Test across multiple blockchain networks</li>
              <li><Text strong>User Experience:</Text> Provide loading states and clear feedback</li>
            </ul>
          </Card>

          <Title level={4}>🔄 Moralis vs The Graph:</Title>
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Text strong>🔥 Moralis:</Text>
                <ul style={{ marginTop: '8px' }}>
                  <li>Ready-to-use APIs</li>
                  <li>Cross-chain support</li>
                  <li>Real-time metadata</li>
                  <li>Built-in authentication</li>
                  <li>Quick setup</li>
                </ul>
              </div>
              <div>
                <Text strong>📊 The Graph:</Text>
                <ul style={{ marginTop: '8px' }}>
                  <li>Custom indexing</li>
                  <li>Complex queries</li>
                  <li>Decentralized protocol</li>
                  <li>Lower latency</li>
                  <li>Custom data models</li>
                </ul>
              </div>
            </div>
            <Alert
              message="💡 Recommendation"
              description="Use both! Moralis for general NFT data and authentication, The Graph for custom marketplace queries and analytics."
              type="success"
              showIcon
              style={{ marginTop: '16px' }}
            />
          </Card>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={1}>
            <DatabaseOutlined /> Moralis Integration Demo
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#666' }}>
            Explore NFTs across multiple blockchains with Moralis powerful APIs
          </Paragraph>
          <div style={{ margin: '16px 0' }}>
            <MoralisStatus />
          </div>
        </div>

        <Tabs defaultActiveKey="1" size="large" items={tabItems} />
      </Space>
    </div>
  );
};

export default MoralisDemo; 