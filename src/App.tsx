import React from "react";
import { Button, Layout } from "antd";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => (
  <Layout>
    <Header style={{ color: "white" }}>NFT Marketplace</Header>
    <Content style={{ padding: "50px" }}>
      <Button type="primary">Mint NFT</Button>
    </Content>
    <Footer style={{ textAlign: "center" }}>©2025 Created by You</Footer>
  </Layout>
);

export default App;
