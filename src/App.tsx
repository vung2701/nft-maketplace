import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Home } from './pages/Home';
import { Marketplace } from './pages/MarketPlace';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="home">
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="marketplace">
              <Link to="/marketplace">Marketplace</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '40px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
