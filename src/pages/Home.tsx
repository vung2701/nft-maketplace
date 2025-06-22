import React from 'react';
import { Typography, Button, Row, Col, Card, Space, Statistic, Badge } from 'antd';
import {
  ShopOutlined,
  PlusOutlined,
  TrophyOutlined,
  RocketOutlined,
  StarOutlined,
  FireOutlined,
  DollarOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const { Title, Paragraph } = Typography;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const features = [
    {
      icon: <ShopOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      title: 'NFT Marketplace',
      description: 'Mua bán NFT với giá cả minh bạch và giao dịch an toàn',
      action: () => navigate('/marketplace'),
      buttonText: 'Khám phá Marketplace'
    },
    {
      icon: <PlusOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      title: 'Tạo NFT',
      description: 'Mint NFT của riêng bạn và chia sẻ với cộng đồng',
      action: () => navigate('/mint'),
      buttonText: 'Tạo NFT ngay'
    },
    {
      icon: <DollarOutlined style={{ fontSize: 48, color: '#faad14' }} />,
      title: 'Dynamic Pricing',
      description: 'Theo dõi giá ETH và gas fees thời gian thực',
      action: () => navigate('/pricing'),
      buttonText: 'Xem giá cả'
    },
    {
      icon: <TrophyOutlined style={{ fontSize: 48, color: '#f5222d' }} />,
      title: 'Rewards System',
      description: 'Nhận thưởng khi tham gia hoạt động trên platform',
      action: () => navigate('/rewards'),
      buttonText: 'Nhận thưởng'
    }
  ];

  // const stats = [
  //   {
  //     title: 'Total NFTs',
  //     value: 1234,
  //     prefix: <FireOutlined style={{ color: '#f5222d' }} />
  //   },
  //   {
  //     title: 'Active Users',
  //     value: 567,
  //     prefix: <UserOutlined style={{ color: '#1890ff' }} />
  //   },
  //   {
  //     title: 'Total Volume',
  //     value: 89.5,
  //     suffix: 'ETH',
  //     prefix: <DollarOutlined style={{ color: '#52c41a' }} />
  //   },
  //   {
  //     title: 'Average Price',
  //     value: 0.15,
  //     suffix: 'ETH',
  //     prefix: <StarOutlined style={{ color: '#faad14' }} />
  //   }
  // ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Hero Section */}
      <div
        style={{
          textAlign: 'center',
          padding: '60px 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 16,
          color: 'white',
          marginBottom: 48
        }}
      >
        <Space direction="vertical" size="large">
          <div>
            <Title level={1} style={{ color: 'white', fontSize: 48, margin: 0 }}>
              🎨 NFT Marketplace
            </Title>
            <Paragraph style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', margin: '16px 0' }}>
              Nền tảng NFT hiện đại với Chainlink Oracle & Real-time Data
            </Paragraph>
          </div>

          {!isConnected ? (
            <div>
              <Paragraph style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 24 }}>
                Kết nối ví để bắt đầu hành trình NFT của bạn
              </Paragraph>
              <ConnectButton />
            </div>
          ) : (
            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<ShopOutlined />}
                onClick={() => navigate('/marketplace')}
                style={{ height: 48, fontSize: 16 }}
              >
                Vào Marketplace
              </Button>
              <Button
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate('/mint')}
                style={{
                  height: 48,
                  fontSize: 16,
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white'
                }}
              >
                Tạo NFT
              </Button>
            </Space>
          )}
        </Space>
      </div>

      {/* Stats Section */}
      {/* <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        ))}
      </Row> */}

      {/* Features Section */}
      <div style={{ marginBottom: 48 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          ✨ Tính năng nổi bật
        </Title>

        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card hoverable style={{ height: '100%', textAlign: 'center' }} bodyStyle={{ padding: 24 }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>{feature.icon}</div>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      {feature.title}
                    </Title>
                    <Paragraph style={{ color: '#666', margin: '8px 0' }}>{feature.description}</Paragraph>
                  </div>
                  <Button type="primary" onClick={feature.action} style={{ width: '100%' }}>
                    {feature.buttonText}
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Technology Section */}
      <Card style={{ marginBottom: 48 }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>🔗 Công nghệ tiên tiến</Title>
          <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
            <Col xs={24} md={8}>
              <Badge.Ribbon text="Oracle" color="blue">
                <Card size="small">
                  <Space direction="vertical" align="center">
                    <RocketOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                    <Title level={5}>Chainlink Oracle</Title>
                    <Paragraph style={{ textAlign: 'center', margin: 0 }}>
                      Giá cả thời gian thực và dữ liệu đáng tin cậy
                    </Paragraph>
                  </Space>
                </Card>
              </Badge.Ribbon>
            </Col>

            <Col xs={24} md={8}>
              <Badge.Ribbon text="Storage" color="green">
                <Card size="small">
                  <Space direction="vertical" align="center">
                    <FireOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                    <Title level={5}>IPFS Storage</Title>
                    <Paragraph style={{ textAlign: 'center', margin: 0 }}>
                      Lưu trữ metadata phi tập trung và bảo mật
                    </Paragraph>
                  </Space>
                </Card>
              </Badge.Ribbon>
            </Col>

            <Col xs={24} md={8}>
              <Badge.Ribbon text="Analytics" color="orange">
                <Card size="small">
                  <Space direction="vertical" align="center">
                    <StarOutlined style={{ fontSize: 32, color: '#faad14' }} />
                    <Title level={5}>The Graph Protocol</Title>
                    <Paragraph style={{ textAlign: 'center', margin: 0 }}>
                      Indexing và query blockchain data hiệu quả
                    </Paragraph>
                  </Space>
                </Card>
              </Badge.Ribbon>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Call to Action */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: 'none',
          textAlign: 'center'
        }}
      >
        <Space direction="vertical" size="large">
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            🚀 Sẵn sàng bắt đầu?
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
            Tham gia cộng đồng NFT và khám phá những tác phẩm độc đáo
          </Paragraph>
          {isConnected ? (
            <Space>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/marketplace')}
                style={{
                  background: 'white',
                  color: '#f5576c',
                  border: 'none',
                  fontWeight: 'bold'
                }}
              >
                Khám phá Marketplace
              </Button>
              <Button
                size="large"
                onClick={() => navigate('/mint')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                Tạo NFT đầu tiên
              </Button>
            </Space>
          ) : (
            <ConnectButton />
          )}
        </Space>
      </Card>
    </div>
  );
};
