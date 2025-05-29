import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Home } from './pages/Home';
import Marketplace from './pages/MarketPlace';
import TheGraphDemo from './pages/TheGraphDemo';
import { ROUTES, DEFAULT_VALUES } from './constants';
import './styles/global.css';

const { Header, Content } = Layout;

const App: React.FC = () => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const path = location.pathname;
    setSelectedKeys([
      path === ROUTES.HOME ? 'home' : 
      path === ROUTES.MARKETPLACE ? 'marketplace' : 
      path === ROUTES.THE_GRAPH ? 'the-graph' : ''
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
              key: 'home',
              label: <Link to={ROUTES.HOME}>Home</Link>
            },
            {
              key: 'marketplace',
              label: <Link to={ROUTES.MARKETPLACE}>Marketplace</Link>
            },
            {
              key: 'the-graph',
              label: <Link to={ROUTES.THE_GRAPH}>The Graph Demo</Link>
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
            <Route path={ROUTES.MARKETPLACE} element={<Marketplace />} />
            <Route path={ROUTES.THE_GRAPH} element={<TheGraphDemo />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
