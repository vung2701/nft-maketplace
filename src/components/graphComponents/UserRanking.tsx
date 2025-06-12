import React from 'react';
import { Card, Table, Avatar, Tag, Typography, Alert, Spin } from 'antd';
import { UserOutlined, CrownOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons';
import { useTopUsers, formatVolume, formatAddress } from '../../hooks/useGraphQL';

const { Text } = Typography;

interface User {
  id: string;
  address: string;
  totalListings: string;
  totalPurchases: string;
  totalSales: string;
  totalVolumeAsBuyer: string;
  totalVolumeAsSeller: string;
}

const UserRanking: React.FC = () => {
  const { data, isLoading, error } = useTopUsers(50);

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
        message="🛠️ Chức năng xếp hạng đang hoàn thiện"
        description="Chức năng xếp hạng người dùng đang được phát triển. Vui lòng chờ đợi!"
        type="warning"
        showIcon
      />
    );
  }

  const users = (data as any)?.users || [];

  if (!users || users.length === 0) {
    return (
      <Alert
        message="🏆 Chưa có dữ liệu xếp hạng"
        description="Chưa có người dùng nào được ghi nhận hoạt động. Hãy thử list hoặc mua NFT để xuất hiện trong bảng xếp hạng!"
        type="info"
        showIcon
      />
    );
  }

  const columns = [
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (rank: number) => {
        if (rank === 1) return <CrownOutlined style={{ color: '#fadb14' }} />;
        if (rank === 2) return <TrophyOutlined style={{ color: '#c0c0c0' }} />;
        if (rank === 3) return <TrophyOutlined style={{ color: '#cd7f32' }} />;
        return <span>{rank}</span>;
      }
    },
    {
      title: 'Người dùng',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => <Text code>{formatAddress(address)}</Text>
    },
    {
      title: 'Đã mua',
      dataIndex: 'totalVolumeAsBuyer',
      key: 'totalVolumeAsBuyer',
      render: (volume: string) => (
        <Text strong style={{ color: '#52c41a' }}>
          {formatVolume(volume)}
        </Text>
      )
    },
    {
      title: 'Đã bán',
      dataIndex: 'totalVolumeAsSeller',
      key: 'totalVolumeAsSeller',
      render: (volume: string) => (
        <Text strong style={{ color: '#1890ff' }}>
          {formatVolume(volume)}
        </Text>
      )
    },
    {
      title: 'Giao dịch',
      key: 'transactions',
      render: (record: User) => (
        <span>
          <Tag color="green">{record.totalPurchases} mua</Tag>
          <Tag color="blue">{record.totalSales} bán</Tag>
        </span>
      )
    }
  ];

  const dataSource = users.map((user: User, index: number) => ({
    ...user,
    rank: index + 1,
    key: user.id
  }));

  return (
    <div style={{ padding: '20px' }}>
      {/* Real-time indicator */}
      <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}>
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: '#fa8c16', fontWeight: 'bold' }}>
            🏆 Bảng xếp hạng thời gian thực • Dựa trên volume giao dịch từ The Graph
          </Text>
        </div>
      </Card>

      <Card
        title={
          <span>
            <TrophyOutlined /> Top người dùng
          </span>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} người dùng`
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default UserRanking;
