import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Home } from './pages/Home';
import Marketplace from './pages/MarketPlace';
import { ROUTES, DEFAULT_VALUES } from './constants';
import './styles/global.css';
import Dashboard from './pages/Dashboard';
import { MintNFT } from './pages/MintNFT';
import Pricing from './pages/Pricing';
import Rewards from './pages/Rewards';
import Rarity from './pages/Rarity';

const { Header, Content } = Layout;

const App = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const path = location.pathname;
    setSelectedKeys([
      path === ROUTES.HOME
        ? '/'
        : path === ROUTES.MARKETPLACE
        ? 'marketplace'
        : path === ROUTES.MINT_NFT
        ? 'mint-nft'
        : path === ROUTES.DASHBOARD
        ? 'dashboard'
        : path === ROUTES.PRICING
        ? 'pricing'
        : path === ROUTES.REWARDS
        ? 'rewards'
        : path === ROUTES.RARITY
        ? 'rarity'
        : ''
    ]);
  }, [location]);

  return (
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={[
            {
              key: 'marketplace',
              label: <Link to={ROUTES.MARKETPLACE}>Marketplace</Link>
            },
            {
              key: 'mint-nft',
              label: <Link to={ROUTES.MINT_NFT}>Mint NFTs</Link>
            },
            {
              key: 'pricing',
              label: <Link to={ROUTES.PRICING}>Dynamic Pricing</Link>
            },
            {
              key: 'rewards',
              label: <Link to={ROUTES.REWARDS}>Rewards</Link>
            },
            {
              key: 'rarity',
              label: <Link to={ROUTES.RARITY}>Rarity</Link>
            },
            {
              key: 'the-graph',
              label: <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
            }
          ]}
        />
      </Header>
      <Content
        style={{
          margin: DEFAULT_VALUES.CONTENT_MARGIN,
          minHeight: `calc(100vh - ${DEFAULT_VALUES.HEADER_HEIGHT}px)`
        }}
      >
        <div className="container">
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.MINT_NFT} element={<MintNFT />} />
            <Route path={ROUTES.MARKETPLACE} element={<Marketplace />} />
            <Route path={ROUTES.PRICING} element={<Pricing />} />
            <Route path={ROUTES.REWARDS} element={<Rewards />} />
            <Route path={ROUTES.RARITY} element={<Rarity />} />
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
