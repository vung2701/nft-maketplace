import React from 'react';
import { Table, Card, Typography, Spin, Alert, Button, Tag } from 'antd';
import { HistoryOutlined, ShoppingOutlined } from '@ant-design/icons';
import { usePurchaseHistory, formatPrice, formatAddress, formatDate } from '../../hooks/useGraphQL';

const { Title, Text } = Typography;

interface Purchase {
  id: string;
  buyer: string;
  seller: string;
  nftAddress: string;
  tokenId: string;
  price: string;
  timestamp: string;
  transactionHash: string;
}

const PurchaseHistory: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = usePurchaseHistory(20);

  const columns = [
    {
      title: 'NFT',
      key: 'nft',
      render: (record: Purchase) => <Text strong>#{record.tokenId}</Text>
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: string) => (
        <Text strong style={{ color: '#1890ff' }}>
          {formatPrice(price).toFixed(4)} ETH
        </Text>
      )
    },
    {
      title: 'Người mua',
      dataIndex: 'buyer',
      key: 'buyer',
      render: (buyer: string) => <Tag color="green">{formatAddress(buyer)}</Tag>
    },
    {
      title: 'Người bán',
      dataIndex: 'seller',
      key: 'seller',
      render: (seller: string) => <Tag color="blue">{formatAddress(seller)}</Tag>
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => <Text>{formatDate(timestamp)}</Text>
    },
    {
      title: 'Giao dịch',
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      render: (hash: string) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank');
          }}
        >
          <HistoryOutlined />
          Xem
        </Button>
      )
    }
  ];

  if (isLoading)
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải lịch sử giao dịch...</Text>
        </div>
      </div>
    );

  if (isError) {
    console.log('The Graph Purchase History Error:', error?.message);

    return (
      <Alert
        message="🛠️ Chức năng đang hoàn thiện"
        description="Chức năng lịch sử giao dịch đang được phát triển. Vui lòng chờ đợi!"
        type="warning"
        showIcon
        action={<Button onClick={() => refetch()}>Thử lại</Button>}
      />
    );
  }

  const purchases: Purchase[] = (data as { purchases: Purchase[] })?.purchases || [];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Title level={3}>
          <ShoppingOutlined /> Lịch sử giao dịch
        </Title>
        <Text type="secondary">Theo dõi tất cả các giao dịch mua bán NFT trên marketplace</Text>
      </div>

      {purchases.length === 0 ? (
        <Alert
          message="Chưa có giao dịch nào"
          description="Chưa có giao dịch mua bán nào được thực hiện."
          type="info"
          showIcon
        />
      ) : (
        <Table
          columns={columns}
          dataSource={purchases}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} giao dịch`
          }}
        />
      )}
    </Card>
  );
};

export default PurchaseHistory;
