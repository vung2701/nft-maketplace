import React, { useState } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select, Space, Typography, Alert, Spin } from 'antd';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined, RiseOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text, Title } = Typography;

interface ChartData {
  date: string;
  volume: number;
  sales: number;
  avgPrice: number;
}

const MarketplaceCharts: React.FC = () => {
  const [timeframe, setTimeframe] = useState<string>('7d');
  const [chartType, setChartType] = useState<string>('volume');

  // Mock data - in real app, this would come from The Graph
  const mockData: ChartData[] = [
    { date: '2024-01-01', volume: 45.2, sales: 12, avgPrice: 3.77 },
    { date: '2024-01-02', volume: 67.8, sales: 18, avgPrice: 3.77 },
    { date: '2024-01-03', volume: 23.4, sales: 8, avgPrice: 2.93 },
    { date: '2024-01-04', volume: 89.1, sales: 25, avgPrice: 3.56 },
    { date: '2024-01-05', volume: 156.7, sales: 42, avgPrice: 3.73 },
    { date: '2024-01-06', volume: 78.9, sales: 21, avgPrice: 3.76 },
    { date: '2024-01-07', volume: 134.5, sales: 35, avgPrice: 3.84 }
  ];

  const totalVolume = mockData.reduce((sum, item) => sum + item.volume, 0);
  const totalSales = mockData.reduce((sum, item) => sum + item.sales, 0);
  const avgPrice = totalVolume / totalSales;
  const volumeChange = mockData.length > 1 ? 
    ((mockData[mockData.length - 1].volume - mockData[0].volume) / mockData[0].volume * 100) : 0;

  return (
    <div style={{ padding: '20px' }}>
      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng Volume (7 ngày)"
              value={totalVolume.toFixed(2)}
              suffix="ETH"
              valueStyle={{ color: '#3f8600' }}
              prefix={<RiseOutlined />}
            />
            <Text type={volumeChange >= 0 ? 'success' : 'danger'} style={{ fontSize: '12px' }}>
              {volumeChange >= 0 ? '+' : ''}{volumeChange.toFixed(1)}% so với tuần trước
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Tổng Sales (7 ngày)"
              value={totalSales}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Giá TB (7 ngày)"
              value={avgPrice.toFixed(3)}
              suffix="ETH"
              valueStyle={{ color: '#722ed1' }}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Ngày hoạt động cao nhất"
              value={Math.max(...mockData.map(d => d.volume)).toFixed(1)}
              suffix="ETH"
              valueStyle={{ color: '#fa8c16' }}
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Chart Controls */}
      <Card size="small" style={{ marginBottom: '16px' }}>
        <Space>
          <Text strong>Bộ lọc:</Text>
          <Select
            value={timeframe}
            onChange={setTimeframe}
            style={{ width: 120 }}
          >
            <Option value="7d">7 ngày</Option>
            <Option value="30d">30 ngày</Option>
            <Option value="90d">90 ngày</Option>
          </Select>
          <Select
            value={chartType}
            onChange={setChartType}
            style={{ width: 150 }}
          >
            <Option value="volume">Volume</Option>
            <Option value="sales">Số lượng Sales</Option>
            <Option value="price">Giá trung bình</Option>
          </Select>
          <RangePicker size="small" />
        </Space>
      </Card>

      {/* Chart Display Area */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <LineChartOutlined />
                <span>Biểu đồ {chartType === 'volume' ? 'Volume' : chartType === 'sales' ? 'Sales' : 'Giá TB'} ({timeframe})</span>
              </Space>
            }
            style={{ height: '400px' }}
          >
            <div style={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#fafafa',
              border: '2px dashed #d9d9d9',
              borderRadius: '6px'
            }}>
              <Space direction="vertical" style={{ textAlign: 'center' }}>
                <LineChartOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                <Text type="secondary">
                  📊 Biểu đồ {chartType === 'volume' ? 'Volume giao dịch' : 
                            chartType === 'sales' ? 'Số lượng bán' : 'Giá trung bình'}
                </Text>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Tích hợp Chart.js hoặc Recharts để hiển thị dữ liệu từ The Graph
                </Text>
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* Top Collections */}
            <Card title="🏆 Top Collections (Volume)" size="small">
              <div style={{ height: '120px', overflow: 'auto' }}>
                {[
                  { name: 'Cool Cats', volume: '245.7 ETH', change: '+12%' },
                  { name: 'Bored Apes', volume: '189.3 ETH', change: '+8%' },
                  { name: 'Crypto Punks', volume: '156.9 ETH', change: '-3%' },
                  { name: 'Art Blocks', volume: '134.2 ETH', change: '+15%' }
                ].map((collection, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < 3 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <div>
                      <Text strong style={{ fontSize: '12px' }}>{collection.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '11px' }}>{collection.volume}</Text>
                    </div>
                    <Text 
                      type={collection.change.startsWith('+') ? 'success' : 'danger'}
                      style={{ fontSize: '11px' }}
                    >
                      {collection.change}
                    </Text>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card title="⚡ Hoạt động gần đây" size="small">
              <div style={{ height: '120px', overflow: 'auto' }}>
                {[
                  { action: 'Mua', item: 'Cool Cat #1234', price: '3.5 ETH', time: '2 phút trước' },
                  { action: 'List', item: 'BAYC #5678', price: '8.2 ETH', time: '5 phút trước' },
                  { action: 'Mua', item: 'Punk #9012', price: '12.1 ETH', time: '8 phút trước' }
                ].map((activity, index) => (
                  <div key={index} style={{ 
                    padding: '6px 0',
                    borderBottom: index < 2 ? '1px solid #f0f0f0' : 'none'
                  }}>
                    <Space>
                      <Text style={{ 
                        fontSize: '10px', 
                        padding: '2px 6px', 
                        backgroundColor: activity.action === 'Mua' ? '#f6ffed' : '#e6f7ff',
                        color: activity.action === 'Mua' ? '#52c41a' : '#1890ff',
                        borderRadius: '3px'
                      }}>
                        {activity.action}
                      </Text>
                      <div>
                        <Text style={{ fontSize: '11px' }}>{activity.item}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '10px' }}>
                          {activity.price} • {activity.time}
                        </Text>
                      </div>
                    </Space>
                  </div>
                ))}
              </div>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card title="📈 Chỉ số hiệu suất" size="small">
            <Row gutter={[16, 8]}>
              <Col xs={12} sm={6} md={3}>
                <Statistic
                  title="Unique Traders"
                  value={847}
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Statistic
                  title="Avg Hold Time"
                  value="23.5d"
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Statistic
                  title="Floor Price"
                  value="2.3 ETH"
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Statistic
                  title="Market Cap"
                  value="1.2M ETH"
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Statistic
                  title="Volume/MC"
                  value="12.5%"
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Statistic
                  title="Active Listings"
                  value={234}
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Statistic
                  title="Success Rate"
                  value="67%"
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Statistic
                  title="Gas Usage"
                  value="45 Gwei"
                  valueStyle={{ fontSize: '16px' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarketplaceCharts; 