import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  HomeOutlined,
  ShopOutlined,
  PlusOutlined,
  DashboardOutlined,
  DollarOutlined,
  GiftOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Pages
import { Home } from './pages/Home';
import MarketPlace from './pages/MarketPlace';
import { MintNFT } from './pages/MintNFT';
import Dashboard from './pages/Dashboard';
import { Pricing } from './pages/Pricing';
import Rewards from './pages/Rewards';

// Providers
import { MoralisProvider } from './providers/MoralisProvider';

// Styles
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {}, [location.pathname]);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Trang chủ'
    },
    {
      key: '/marketplace',
      icon: <ShopOutlined />,
      label: 'Marketplace'
    },
    {
      key: '/mint',
      icon: <PlusOutlined />,
      label: 'Tạo NFT'
    },
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/pricing',
      icon: <DollarOutlined />,
      label: 'Giá cả'
    },
    {
      key: '/rewards',
      icon: <GiftOutlined />,
      label: 'Rewards'
    }
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light" width={250}>
        <div
          style={{
            padding: '16px',
            textAlign: 'center',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? '🎨' : '🎨 NFT Market'}
          </Title>
        </div>

        <Menu
          theme="light"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <WalletOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>
              NFT Marketplace
            </Title>
          </div>

          <ConnectButton />
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)'
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/mint" element={<MintNFT />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/rewards" element={<Rewards />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <MoralisProvider>
      <Router>
        <AppContent />
      </Router>
    </MoralisProvider>
  );
};

export default App;
