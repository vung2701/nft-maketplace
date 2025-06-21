import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Statistic, Row, Col, Badge, Progress, Tabs } from 'antd';
import { TrophyOutlined, GiftOutlined, CrownOutlined, FireOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';
import { useChainlinkContracts } from '../../hooks/useChainlinkContracts';
import type { UserReward, RewardDistribution, UserActivity } from '../../types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export const AutomatedRewards: React.FC = () => {
  const { address } = useAccount();
  const {
    userActivity,
    userRewards,
    getTopTraders,
    getRewardHistory,
    isLoading
  } = useChainlinkContracts();

  const [topTraders, setTopTraders] = useState<UserReward[]>([]);
  const [rewardHistory, setRewardHistory] = useState<RewardDistribution[]>([]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const [traders, history] = await Promise.all([
        getTopTraders(),
        getRewardHistory()
      ]);
      setTopTraders(traders);
      setRewardHistory(history);
    };
    loadData();
  }, [getTopTraders, getRewardHistory]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <CrownOutlined style={{ color: '#FFD700' }} />;
      case 2: return <TrophyOutlined style={{ color: '#C0C0C0' }} />;
      case 3: return <TrophyOutlined style={{ color: '#CD7F32' }} />;
      default: return <FireOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return '#CD7F32';
      default: return '#1890ff';
    }
  };

  const leaderboardColumns = [
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank: number) => (
        <Space>
          {getRankIcon(rank)}
          <Text strong style={{ color: getRankColor(rank) }}>#{rank}</Text>
        </Space>
      ),
    },
    {
      title: 'Trader',
      dataIndex: 'user',
      key: 'user',
      render: (userAddress: string) => (
        <div>
          <Text code style={{ fontSize: '12px' }}>
            {`${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`}
          </Text>
          {userAddress.toLowerCase() === address?.toLowerCase() && (
            <Badge status="processing" text="Bạn" style={{ marginLeft: '8px' }} />
          )}
        </div>
      ),
    },
    {
      title: 'Volume Trading',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => (
        <Text strong>{parseFloat(amount).toFixed(4)} ETH</Text>
      ),
    },
    {
      title: 'Tỷ lệ %',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: string, record: UserReward) => (
        <div>
          <Progress 
            percent={parseFloat(percentage)} 
            size="small" 
            strokeColor={getRankColor(record.rank)}
            showInfo={false}
          />
          <Text style={{ color: getRankColor(record.rank) }}>{percentage}%</Text>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <GiftOutlined /> Hệ thống Rewards Tự động
      </Title>
      
      {/* User Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Reward Balance"
              value={parseFloat(userRewards)}
              precision={4}
              suffix="REWARD"
              valueStyle={{ color: '#52c41a' }}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Trading Volume"
              value={userActivity?.tradingVolume ? parseFloat(userActivity.tradingVolume) : 0}
              precision={4}
              suffix="ETH"
              valueStyle={{ color: '#1890ff' }}
              prefix={<FireOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Giao dịch"
              value={userActivity?.transactionCount || 0}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Hoạt động cuối"
              value={userActivity?.lastActive ? 
                new Date(parseInt(userActivity.lastActive) * 1000).toLocaleDateString('vi-VN') : 
                'Chưa có'
              }
              valueStyle={{ color: '#722ed1', fontSize: '14px' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="🏆 Top Traders - Tuần này"
        extra={
          <Text type="secondary">
            Rewards sẽ được phân phối tự động mỗi tuần
          </Text>
        }
      >
        <Table
          dataSource={topTraders}
          columns={leaderboardColumns}
          rowKey="user"
          pagination={false}
          loading={isLoading}
          rowClassName={(record) => 
            record.user.toLowerCase() === address?.toLowerCase() ? 'highlight-row' : ''
          }
        />
        
        {topTraders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">
              Chưa có dữ liệu trading. Bắt đầu giao dịch để tham gia xếp hạng!
            </Text>
          </div>
        )}
      </Card>

      <style>{`
        .highlight-row {
          background-color: #e6f7ff !important;
          border: 2px solid #1890ff;
        }
      `}</style>
    </div>
  );
}; 