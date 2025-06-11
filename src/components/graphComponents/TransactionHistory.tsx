import React, { useState } from 'react';
import { Card, Table, Tag, Typography, Alert, Spin, Button, Space, Input, DatePicker, Select } from 'antd';
import { HistoryOutlined, ShoppingCartOutlined, DollarOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { usePurchaseHistory, formatVolume, formatAddress, formatDate } from '../../hooks/useGraphQL';

const { Text, Link } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface Purchase {
  id: string;
  buyer: {
    id: string;
    address: string;
    totalPurchases: string;
  };
  seller: {
    id: string;
    address: string;
    totalSales: string;
  };
  nftAddress: string;
  tokenId: string;
  price: string;
  timestamp: string;
  transactionHash: string;
  listing?: {
    id: string;
    listingId: string;
    listedAt: string;
  };
}

const TransactionHistory: React.FC = () => {
  const [filterPrice, setFilterPrice] = useState<string>('');
  const [filterAddress, setFilterAddress] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [pageSize, setPageSize] = useState<number>(20);

  const { data, isLoading, error } = usePurchaseHistory(100);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="🛠️ Chức năng lịch sử giao dịch đang hoàn thiện"
        description="Chức năng lịch sử giao dịch đang được phát triển. Vui lòng chờ đợi!"
        type="warning"
        showIcon
      />
    );
  }

  const purchases = (data as any)?.purchases || [];

  if (!purchases || purchases.length === 0) {
    return (
      <Alert
        message="📈 Chưa có dữ liệu giao dịch"
        description="Chưa có giao dịch nào được ghi nhận. Hãy thử mua NFT để tạo lịch sử giao dịch!"
        type="info"
        showIcon
      />
    );
  }

  // Filter purchases based on search criteria
  const filteredPurchases = purchases.filter((purchase: Purchase) => {
    const matchesPrice = !filterPrice || 
      parseFloat(purchase.price) >= parseFloat(filterPrice);
    const matchesAddress = !filterAddress || 
      purchase.buyer.address.toLowerCase().includes(filterAddress.toLowerCase()) ||
      purchase.seller.address.toLowerCase().includes(filterAddress.toLowerCase());
    
    return matchesPrice && matchesAddress;
  });

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      sorter: (a: Purchase, b: Purchase) => 
        parseInt(a.timestamp) - parseInt(b.timestamp),
              render: (timestamp: string) => (
          <Text style={{ fontSize: '12px' }}>
            {formatDate(timestamp)}
          </Text>
        )
    },
    {
      title: 'NFT',
      key: 'nft',
      width: 200,
      render: (record: Purchase) => (
        <div>
          <Text code style={{ fontSize: '11px', display: 'block' }}>
            {formatAddress(record.nftAddress)}
          </Text>
          <Tag color="blue" style={{ margin: '2px 0' }}>
            #{record.tokenId}
          </Tag>
        </div>
      )
    },
    {
      title: 'Người mua',
      dataIndex: ['buyer', 'address'],
      key: 'buyer',
      width: 150,
      render: (address: string, record: Purchase) => (
        <div>
          <Text code style={{ fontSize: '11px', color: '#52c41a' }}>
            {formatAddress(address)}
          </Text>
          <div style={{ fontSize: '10px', color: '#8c8c8c' }}>
            {record.buyer.totalPurchases} giao dịch
          </div>
        </div>
      )
    },
    {
      title: 'Người bán',
      dataIndex: ['seller', 'address'],
      key: 'seller',
      width: 150,
      render: (address: string, record: Purchase) => (
        <div>
          <Text code style={{ fontSize: '11px', color: '#1890ff' }}>
            {formatAddress(address)}
          </Text>
          <div style={{ fontSize: '10px', color: '#8c8c8c' }}>
            {record.seller.totalSales} đã bán
          </div>
        </div>
      )
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      sorter: (a: Purchase, b: Purchase) => 
        parseFloat(a.price) - parseFloat(b.price),
      render: (price: string) => (
        <Text strong style={{ color: '#faad14' }}>
          {formatVolume(price)}
        </Text>
      )
    },
    {
      title: 'Listing Time',
      key: 'listingTime',
      width: 120,
      render: (record: Purchase) => {
        if (!record.listing) return <Text type="secondary">-</Text>;
        
        const listingTime = parseInt(record.listing.listedAt);
        const purchaseTime = parseInt(record.timestamp);
        const timeDiff = Math.floor((purchaseTime - listingTime) / 3600); // hours
        
        return (
          <Tag color={timeDiff < 24 ? 'red' : timeDiff < 168 ? 'orange' : 'green'}>
            {timeDiff < 1 ? '< 1h' : 
             timeDiff < 24 ? `${timeDiff}h` : 
             `${Math.floor(timeDiff / 24)}d`}
          </Tag>
        );
      }
    },
    {
      title: 'TX Hash',
      dataIndex: 'transactionHash',
      key: 'transactionHash',
      width: 150,
      render: (hash: string) => (
        <Link 
          href={`https://sepolia.etherscan.io/tx/${hash}`} 
          target="_blank"
          style={{ fontSize: '11px' }}
        >
          {formatAddress(hash)}
        </Link>
      )
    }
  ];

  const dataSource = filteredPurchases.map((purchase: Purchase) => ({
    ...purchase,
    key: purchase.id
  }));

  // Calculate statistics
  const totalVolume = purchases.reduce((sum: number, p: Purchase) => 
    sum + parseFloat(p.price), 0);
  const avgPrice = totalVolume / purchases.length;
  const uniqueBuyers = new Set(purchases.map((p: Purchase) => p.buyer.address)).size;
  const uniqueSellers = new Set(purchases.map((p: Purchase) => p.seller.address)).size;

  return (
    <div style={{ padding: '20px' }}>
      {/* Real-time indicator */}
      <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#e6f7ff', border: '1px solid #91d5ff' }}>
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#1890ff', fontWeight: 'bold' }}>
            📡 Lịch sử giao dịch thời gian thực • Cập nhật tự động từ The Graph
          </Text>
        </div>
      </Card>

      {/* Summary Stats */}
      <Card size="small" style={{ marginBottom: '16px' }}>
        <Space size="large">
          <div>
            <Text type="secondary">Tổng giao dịch:</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
              {purchases.length}
            </div>
          </div>
          <div>
            <Text type="secondary">Tổng volume:</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
              {formatVolume(totalVolume.toString())}
            </div>
          </div>
          <div>
            <Text type="secondary">Giá trung bình:</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#faad14' }}>
              {formatVolume(avgPrice.toString())}
            </div>
          </div>
          <div>
            <Text type="secondary">Người mua:</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#722ed1' }}>
              {uniqueBuyers}
            </div>
          </div>
          <div>
            <Text type="secondary">Người bán:</Text>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#eb2f96' }}>
              {uniqueSellers}
            </div>
          </div>
        </Space>
      </Card>

      {/* Filters */}
      <Card size="small" style={{ marginBottom: '16px' }}>
        <Space wrap>
          <Input
            placeholder="Tìm theo địa chỉ"
            prefix={<SearchOutlined />}
            value={filterAddress}
            onChange={(e) => setFilterAddress(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Input
            placeholder="Giá tối thiểu (ETH)"
            prefix={<DollarOutlined />}
            value={filterPrice}
            onChange={(e) => setFilterPrice(e.target.value)}
            style={{ width: 150 }}
            allowClear
          />
          <Select
            placeholder="Sắp xếp theo"
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 150 }}
          >
            <Option value="timestamp">Thời gian</Option>
            <Option value="price">Giá</Option>
          </Select>
          <Select
            placeholder="Số dòng"
            value={pageSize}
            onChange={setPageSize}
            style={{ width: 120 }}
          >
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
            <Option value={100}>100</Option>
          </Select>
        </Space>
      </Card>

      {/* Transaction Table */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HistoryOutlined style={{ color: '#1890ff' }} />
            <span>Lịch sử giao dịch ({filteredPurchases.length})</span>
          </div>
        }
        size="small"
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} giao dịch`
          }}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default TransactionHistory; 