import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Statistic, Row, Col, Button, Progress, Tag, Alert } from 'antd';
import { DollarOutlined, LineChartOutlined, FireOutlined, ClockCircleOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useChainlinkContracts } from '../../hooks/useChainlinkContracts';
import { 
  fetchMarketData, 
  fetchRealTimeGas, 
  fetchDeFiData,
  formatCurrency,
  formatLargeNumber 
} from '../../services/realTimeData';
import type { Transaction } from '../../types';

const { Title, Text } = Typography;

// ES6 Utility functions
const formatAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const formatDate = (timestamp) => new Date(parseInt(timestamp) * 1000).toLocaleString('vi-VN');

// Network congestion level based on real gas prices
const getNetworkStatus = (gasFee) => {
  if (gasFee < 15) return { status: 'Thấp', color: 'success' as const, level: 25 };
  if (gasFee < 30) return { status: 'Trung bình', color: 'normal' as const, level: 50 };
  if (gasFee < 50) return { status: 'Cao', color: 'normal' as const, level: 75 };
  return { status: 'Rất cao', color: 'exception' as const, level: 95 };
};

export const DynamicPricing = () => {
  const { getAllTransactions, isLoading } = useChainlinkContracts();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [marketData, setMarketData] = useState<any>(null);
  const [gasFees, setGasFees] = useState<any>(null);
  const [defiData, setDefiData] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real-world data
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [market, gas, defi] = await Promise.all([
        fetchMarketData(),
        fetchRealTimeGas(), 
        fetchDeFiData()
      ]);
      
      setMarketData(market);
      setGasFees(gas);
      setDefiData(defi);
      setLastUpdate(new Date());
    } catch (err) {
      setError('Không thể tải dữ liệu real-time. Hiển thị dữ liệu fallback.');
      console.error('Error fetching real data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto refresh every 2 minutes
  useEffect(() => {
    fetchAllData();
    
    const interval = setInterval(() => {
      fetchAllData();
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, []);

  // Load transactions
  useEffect(() => {
    getAllTransactions().then(setTransactions);
  }, [getAllTransactions]);

  const networkStatus = gasFees ? getNetworkStatus(gasFees.standard.fee) : null;

  // Transaction history columns
  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
      render: (address) => <Text code>{formatAddress(address)}</Text>,
    },
    {
      title: 'ETH',
      dataIndex: 'amountETH',
      key: 'amountETH',
      render: (amount) => <Text strong>{parseFloat(amount).toFixed(4)} ETH</Text>,
    },
    {
      title: 'USD',
      dataIndex: 'amountUSD',
      key: 'amountUSD',
      render: (amount) => <Text>{formatCurrency(amount)}</Text>,
    },
    {
      title: 'Gas Fee',
      dataIndex: 'feeETH',
      key: 'feeETH',
      render: (fee) => <Text type="warning">{parseFloat(fee).toFixed(6)} ETH</Text>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => <Text style={{ fontSize: 12 }}>{formatDate(timestamp)}</Text>,
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Title level={3}>Đang tải dữ liệu real-time...</Title>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <LineChartOutlined /> Real-time Market Data
      </Title>

      {error && (
        <Alert
          message="Cảnh báo"
          description={error}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      
      <Row gutter={[24, 24]}>
        {/* ETH Price & Market Data */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Giá ETH/USD"
              value={marketData?.price || 0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ 
                color: marketData?.change24h >= 0 ? '#52c41a' : '#ff4d4f' 
              }}
            />
                         <div style={{ marginTop: 8 }}>
               {marketData?.change24h >= 0 ? (
                 <RiseOutlined style={{ color: '#52c41a', marginRight: 4 }} />
               ) : (
                 <FallOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
               )}
              <Text style={{ 
                color: marketData?.change24h >= 0 ? '#52c41a' : '#ff4d4f',
                fontSize: 12 
              }}>
                {marketData?.change24h >= 0 ? '+' : ''}{marketData?.change24h?.toFixed(2)}% (24h)
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 11 }}>
              Market Cap: {formatLargeNumber(marketData?.marketCap || 0)}
            </Text>
          </Card>
        </Col>

        {/* Network Status */}
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Text strong>Network Congestion</Text>
              <br />
              {networkStatus && (
                <>
                  <Progress 
                    percent={networkStatus.level} 
                    status={networkStatus.color}
                    strokeColor={
                      networkStatus.color === 'success' ? '#52c41a' :
                      networkStatus.color === 'normal' ? '#faad14' : '#ff4d4f'
                    }
                    style={{ marginTop: 8 }}
                  />
                  <Tag color={
                    networkStatus.color === 'success' ? 'green' :
                    networkStatus.color === 'normal' ? 'orange' : 'red'
                  } style={{ marginTop: 8 }}>
                    {networkStatus.status}
                  </Tag>
                </>
              )}
            </div>
          </Card>
        </Col>

        {/* Last Update */}
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Cập nhật lần cuối"
              value={lastUpdate.toLocaleTimeString('vi-VN')}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ fontSize: 16 }}
            />
            <Button 
              type="link" 
              size="small"
              loading={loading}
              onClick={fetchAllData}
            >
              Làm mới ngay
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Real Gas Fee Estimates */}
      <Card title={<><FireOutlined /> Real-time Gas Fees</>} style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ color: '#52c41a' }}>🐌 Slow</Text>
                <br />
                <Title level={4} style={{ color: '#52c41a', margin: '8px 0' }}>
                  {gasFees?.slow?.fee || 0} gwei
                </Title>
                <Text type="secondary">{gasFees?.slow?.time}</Text>
                <br />
                <Text style={{ fontSize: 11, color: '#666' }}>
                  ~{formatCurrency(gasFees?.slow?.usd || 0)}
                </Text>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={6}>
            <Card size="small" style={{ background: '#fff7e6', border: '1px solid #ffd591' }}>
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ color: '#fa8c16' }}>⚡ Standard</Text>
                <br />
                <Title level={4} style={{ color: '#fa8c16', margin: '8px 0' }}>
                  {gasFees?.standard?.fee || 0} gwei
                </Title>
                <Text type="secondary">{gasFees?.standard?.time}</Text>
                <br />
                <Text style={{ fontSize: 11, color: '#666' }}>
                  ~{formatCurrency(gasFees?.standard?.usd || 0)}
                </Text>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={6}>
            <Card size="small" style={{ background: '#fff2f0', border: '1px solid #ffb3b3' }}>
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ color: '#ff4d4f' }}>🚀 Fast</Text>
                <br />
                <Title level={4} style={{ color: '#ff4d4f', margin: '8px 0' }}>
                  {gasFees?.fast?.fee || 0} gwei
                </Title>
                <Text type="secondary">{gasFees?.fast?.time}</Text>
                <br />
                <Text style={{ fontSize: 11, color: '#666' }}>
                  ~{formatCurrency(gasFees?.fast?.usd || 0)}
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={6}>
            <Card size="small" style={{ background: '#f9f0ff', border: '1px solid #d3adf7' }}>
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ color: '#722ed1' }}>⚡ Fastest</Text>
                <br />
                <Title level={4} style={{ color: '#722ed1', margin: '8px 0' }}>
                  {gasFees?.fastest?.fee || 0} gwei
                </Title>
                <Text type="secondary">{gasFees?.fastest?.time}</Text>
                <br />
                <Text style={{ fontSize: 11, color: '#666' }}>
                  ~{formatCurrency(gasFees?.fastest?.usd || 0)}
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
        
        <div style={{ marginTop: 16, padding: 12, background: '#fafafa', borderRadius: 6 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            💡 <strong>Real Data:</strong> Gas fees được cập nhật từ Etherscan & ETH Gas Station. 
            Giá ETH từ CoinGecko API. Dữ liệu refresh mỗi 2 phút.
          </Text>
        </div>
      </Card>

      {/* Top DeFi Protocols */}
      {defiData.length > 0 && (
        <Card title="🏦 Top DeFi Protocols trên Ethereum" style={{ marginTop: 24 }}>
          <Row gutter={[16, 16]}>
            {defiData.slice(0, 6).map((protocol, index) => (
              <Col xs={24} sm={12} md={8} key={protocol.name}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <Text strong>#{index + 1} {protocol.name}</Text>
                    <br />
                    <Title level={5} style={{ margin: '4px 0', color: '#1890ff' }}>
                      {formatLargeNumber(protocol.tvl)}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      TVL • {protocol.category}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Transaction History */}
      <Card 
        title="Lịch sử giao dịch gần đây" 
        style={{ marginTop: 24 }}
        extra={
          <Button 
            type="link" 
            onClick={() => getAllTransactions().then(setTransactions)}
          >
            Làm mới
          </Button>
        }
      >
        <Table
          dataSource={transactions}
          columns={columns}
          rowKey={(record) => `${record.user}-${record.timestamp}`}
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} giao dịch` }}
          loading={isLoading}
          size="small"
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
}; 