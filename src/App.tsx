import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Home } from './pages/Home';
import './App.css';
import Marketplace from './pages/MarketPlace';
import { useEffect, useState } from 'react';

const { Header, Content } = Layout;

function App() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    // Xác định key dựa trên pathname
    const path = location.pathname;
    if (path === '/') {
      setSelectedKeys(['home']);
    } else if (path === '/marketplace') {
      setSelectedKeys(['marketplace']);
    } else {
      setSelectedKeys([]);
    }
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
              label: <Link to="/">Home</Link>
            },
            {
              key: 'marketplace',
              label: <Link to="/marketplace">Marketplace</Link>
            }
          ]}
        />
      </Header>
      <Content style={{ margin: '40px', minHeight: 'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </Content>
    </Layout>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
