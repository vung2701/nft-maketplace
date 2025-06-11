import React, { useState, useEffect } from 'react';
import { Card, Badge, Typography, Space, Button, Alert, Descriptions, Divider } from 'antd';
import { 
  ApiOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined, 
  ReloadOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Text, Link } = Typography;

interface GraphStatusProps {
  style?: React.CSSProperties;
}

const GraphStatus: React.FC<GraphStatusProps> = ({ style }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // Mock connection check - in real app, this would ping The Graph endpoint
  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      try {
        // Simulate API check
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock random connection status for demo
        const connected = Math.random() > 0.3; // 70% chance of being connected
        setIsConnected(connected);
        setLastUpdate(new Date().toLocaleTimeString('vi-VN'));
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
    
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsConnected(true);
      setLastUpdate(new Date().toLocaleTimeString('vi-VN'));
      setIsLoading(false);
    }, 1000);
  };

  const getStatusBadge = () => {
    if (isLoading) {
      return <Badge status="processing" text="Đang kiểm tra..." />;
    }
    return isConnected 
      ? <Badge status="success" text="Đã kết nối" />
      : <Badge status="error" text="Mất kết nối" />;
  };

  const getStatusIcon = () => {
    if (isLoading) return <ReloadOutlined spin />;
    return isConnected 
      ? <CheckCircleOutlined style={{ color: '#52c41a' }} />
      : <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
  };

  return (
    <Card 
      size="small" 
      style={{ 
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '280px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        ...style
      }}
      title={
        <Space>
          <ApiOutlined />
          <span>Trạng thái real-time</span>
        </Space>
      }
      extra={
        <Button 
          type="text" 
          size="small" 
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={isLoading}
        />
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            {getStatusIcon()}
            {getStatusBadge()}
          </Space>
        </div>

                 {!isConnected && !isLoading && (
           <Alert
             message="Kết nối The Graph thất bại"
             description="Đang sử dụng dữ liệu demo"
             type="warning"
             showIcon
           />
         )}

        <Descriptions column={1} size="small">
          <Descriptions.Item 
            label={<Space><DatabaseOutlined style={{ fontSize: '12px' }} />Subgraph</Space>}
          >
            <Link 
              href="https://api.studio.thegraph.com/query/112713/nft-marketplace/version/latest" 
              target="_blank"
              style={{ fontSize: '11px' }}
            >
              NFT Marketplace v1.0
            </Link>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={<Space><GlobalOutlined style={{ fontSize: '12px' }} />Network</Space>}
          >
            <Text style={{ fontSize: '11px' }}>Sepolia Testnet</Text>
          </Descriptions.Item>
          
          <Descriptions.Item 
            label={<Space><ClockCircleOutlined style={{ fontSize: '12px' }} />Cập nhật</Space>}
          >
            <Text style={{ fontSize: '11px' }}>
              {lastUpdate || 'Chưa có dữ liệu'}
            </Text>
          </Descriptions.Item>
        </Descriptions>

        <Divider style={{ margin: '8px 0' }} />
        
        <div style={{ fontSize: '10px', color: '#8c8c8c', textAlign: 'center' }}>
          <Space split={<span>•</span>}>
            <span>Real-time data</span>
            <span>Auto-refresh: 30s</span>
            <span>Powered by The Graph</span>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default GraphStatus; 