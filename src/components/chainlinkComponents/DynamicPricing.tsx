import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Table, Typography, Statistic, Row, Col } from 'antd';
import { DollarOutlined, LineChartOutlined, CalculatorOutlined } from '@ant-design/icons';
import { useChainlinkContracts } from '../../hooks/useChainlinkContracts';
import type { Transaction, FeeCalculation } from '../../types';

const { Title, Text } = Typography;

// ES6 Utility functions với arrow functions và default parameters
const formatAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const formatNumber = (num, decimals = 4) => parseFloat(num.toString()).toFixed(decimals);
const formatDate = (timestamp) => new Date(parseInt(timestamp) * 1000).toLocaleString('vi-VN');

export const DynamicPricing = () => {
  const { ethPrice, calculateFee, payFee, getAllTransactions, isLoading } = useChainlinkContracts();
  
  // ES6 destructuring với default values
  const [ethAmount, setEthAmount] = useState('');
  const [feeCalculation, setFeeCalculation] = useState<FeeCalculation | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [paying, setPaying] = useState(false);

  // ES6 useEffect với arrow functions
  useEffect(() => {
    getAllTransactions().then(setTransactions);
  }, [getAllTransactions]);

  // ES6 debounce với arrow function
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (ethAmount && parseFloat(ethAmount) > 0) {
        setCalculating(true);
        try {
          const calculation = await calculateFee(ethAmount);
          setFeeCalculation(calculation);
        } catch (error) {
          console.error('Error calculating fee:', error);
        } finally {
          setCalculating(false);
        }
      } else {
        setFeeCalculation(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [ethAmount, calculateFee]);

  // ES6 async/await với arrow function
  const handlePayFee = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) return;
    
    setPaying(true);
    try {
      const success = await payFee(ethAmount);
      if (success) {
        const txs = await getAllTransactions();
        setTransactions(txs);
        setEthAmount('');
        setFeeCalculation(null);
      }
    } catch (error) {
      console.error('Error paying fee:', error);
    } finally {
      setPaying(false);
    }
  };

  // ES6 Array với arrow functions trong render
  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
      render: (address) => <Text code>{formatAddress(address)}</Text>,
    },
    {
      title: 'ETH',
      dataIndex: 'amountETH',
      key: 'amountETH',
      render: (amount) => <Text strong>{formatNumber(amount)} ETH</Text>,
    },
    {
      title: 'USD',
      dataIndex: 'amountUSD',
      key: 'amountUSD',
      render: (amount) => <Text>${formatNumber(amount, 2)}</Text>,
    },
    {
      title: 'Phí',
      dataIndex: 'feeETH',
      key: 'feeETH',
      render: (fee) => <Text type="warning">{formatNumber(fee, 6)} ETH</Text>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => <Text style={{ fontSize: 12 }}>{formatDate(timestamp)}</Text>,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <LineChartOutlined /> Dynamic Pricing
      </Title>
      
      <Row gutter={[24, 24]}>
        {/* Price Display */}
        <Col xs={24} lg={8}>
          <Card>
            <Statistic
              title="Giá ETH/USD"
              value={formatNumber(ethPrice, 2)}
              prefix={<DollarOutlined />}
              suffix="USD"
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Từ Chainlink Oracle
            </Text>
          </Card>
        </Col>

        {/* Fee Calculator */}
        <Col xs={24} lg={16}>
          <Card title={<><CalculatorOutlined /> Tính phí giao dịch</>}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <Input
                placeholder="Nhập số ETH"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                suffix="ETH"
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                onClick={handlePayFee}
                loading={paying}
                disabled={!feeCalculation || parseFloat(ethAmount) <= 0}
              >
                Thanh toán
              </Button>
            </div>

            {/* ES6 conditional rendering */}
            {calculating && <Text type="secondary">Đang tính toán...</Text>}

            {/* ES6 conditional rendering với object destructuring */}
            {feeCalculation && (
              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small" style={{ background: '#f6ffed' }}>
                    <Statistic
                      title="Phí ETH (2%)"
                      value={formatNumber(feeCalculation.feeETH, 6)}
                      suffix="ETH"
                      valueStyle={{ color: '#52c41a', fontSize: 16 }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" style={{ background: '#fff7e6' }}>
                    <Statistic
                      title="Phí USD"
                      value={formatNumber(feeCalculation.feeUSD, 2)}
                      prefix="$"
                      valueStyle={{ color: '#fa8c16', fontSize: 16 }}
                    />
                  </Card>
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      {/* Transaction History */}
      <Card 
        title="Lịch sử giao dịch" 
        style={{ marginTop: 24 }}
        extra={
          <Button 
            type="link" 
            onClick={() => getAllTransactions().then(setTransactions)}
          >
            Làm mới
          </Button>
        }
      >
        <Table
          dataSource={transactions}
          columns={columns}
          rowKey={(record) => `${record.user}-${record.timestamp}`}
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} giao dịch` }}
          loading={isLoading}
          size="small"
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
}; 