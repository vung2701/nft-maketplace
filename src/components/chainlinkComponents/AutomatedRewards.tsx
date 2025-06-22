import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Statistic, Row, Col, Badge, Progress, Alert } from 'antd';
import { TrophyOutlined, GiftOutlined, CrownOutlined, FireOutlined } from '@ant-design/icons';
import { useAccount } from 'wagmi';
import { useChainlinkContracts } from '../../hooks/useChainlinkContracts';
import { isMockData } from './utils';
import type { UserReward } from '../../types';

const { Title, Text } = Typography;

// Utility functions với ES6
const formatAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const formatNumber = (num, decimals = 4) => parseFloat(num.toString()).toFixed(decimals);

// ES6 Object với computed properties
const RANK_CONFIGS = {
  1: { icon: CrownOutlined, color: '#FFD700' },
  2: { icon: TrophyOutlined, color: '#C0C0C0' },
  3: { icon: TrophyOutlined, color: '#CD7F32' },
  default: { icon: FireOutlined, color: '#1890ff' }
};

export const AutomatedRewards = () => {
  const { address } = useAccount();
  const { userActivity, userRewards, getTopTraders, isLoading } = useChainlinkContracts();
  const [topTraders, setTopTraders] = useState<UserReward[]>([]);

  // ES6 useEffect with arrow function
  useEffect(() => {
    getTopTraders().then(setTopTraders);
  }, [getTopTraders]);

  // ES6 arrow function with default parameter
  const getRankConfig = (rank) => RANK_CONFIGS[rank] || RANK_CONFIGS.default;

  // ES6 Array methods và destructuring
  const columns = [
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank) => {
        const { icon: IconComponent, color } = getRankConfig(rank);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconComponent style={{ color }} />
            <Text strong style={{ color }}>#{rank}</Text>
          </div>
        );
      },
    },
    {
      title: 'Trader',
      dataIndex: 'user',
      key: 'user',
      render: (userAddress) => (
        <div>
          <Text code style={{ fontSize: 12 }}>{formatAddress(userAddress)}</Text>
          {userAddress.toLowerCase() === address?.toLowerCase() && (
            <Badge status="processing" text="Bạn" style={{ marginLeft: 8 }} />
          )}
        </div>
      ),
    },
    {
      title: 'Volume',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <Text strong>{formatNumber(amount)} ETH</Text>,
    },
    {
      title: '%',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage, record) => {
        const { color } = getRankConfig(record.rank);
        return (
          <div>
            <Progress 
              percent={parseFloat(percentage)} 
              size="small" 
              strokeColor={color}
              showInfo={false}
            />
            <Text style={{ color }}>{percentage}%</Text>
          </div>
        );
      },
    },
  ];

  // ES6 Object shorthand và template literals
  const statsData = [
    {
      title: "Rewards",
      value: formatNumber(userRewards),
      suffix: "REWARD",
      color: "#52c41a",
      icon: GiftOutlined
    },
    {
      title: "Volume", 
      value: formatNumber(userActivity?.tradingVolume || "0"),
      suffix: "ETH",
      color: "#1890ff",
      icon: FireOutlined
    },
    {
      title: "Giao dịch",
      value: userActivity?.transactionCount || 0,
      suffix: "",
      color: "#fa8c16", 
      icon: TrophyOutlined
    }
  ];

  // Check if using mock data
  const isUsingMockData = isMockData(topTraders);

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <GiftOutlined /> Hệ thống Rewards
      </Title>
      
      {/* Mock Data Warning */}
      {isUsingMockData && (
        <Alert
          message="Demo Mode"
          description="Smart contract chưa được deploy. Đang hiển thị dữ liệu demo."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
      
      {/* User Stats với ES6 map */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statsData.map((stat, index) => {
          const { icon: IconComponent, ...restStat } = stat;
          return (
            <Col xs={24} sm={8} key={index}>
              <Card>
                <Statistic
                  {...restStat}
                  precision={typeof stat.value === 'string' ? 4 : 0}
                  valueStyle={{ color: stat.color }}
                  prefix={<IconComponent />}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Leaderboard */}
      <Card title="🏆 Top Traders">
        <Table
          dataSource={topTraders}
          columns={columns}
          rowKey="user"
          pagination={false}
          loading={isLoading}
          size="small"
          rowClassName={(record) => 
            record.user.toLowerCase() === address?.toLowerCase() ? 'highlight-row' : ''
          }
        />
        
        {/* ES6 conditional rendering */}
        {topTraders.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">
              Chưa có dữ liệu. Bắt đầu giao dịch để tham gia xếp hạng!
            </Text>
          </div>
        )}
      </Card>

      {/* ES6 template literals trong CSS */}
      <style>{`
        .highlight-row {
          background-color: #e6f7ff !important;
          border: 2px solid #1890ff;
        }
      `}</style>
    </div>
  );
}; 