import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { Home } from './pages/Home';
import { Marketplace } from './pages/MarketPlace';
import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout>
        <Header>
          <Menu
            theme="dark"
            mode="horizontal"
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
    </Router>
  );
}

export default App;
