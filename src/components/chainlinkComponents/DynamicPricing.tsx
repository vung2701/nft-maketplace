import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Table, Typography, Space, Statistic, Row, Col } from 'antd';
import { DollarOutlined, LineChartOutlined, CalculatorOutlined } from '@ant-design/icons';
import { useChainlinkContracts } from '../../hooks/useChainlinkContracts';
import type { Transaction, FeeCalculation } from '../../types';

const { Title, Text } = Typography;

export const DynamicPricing: React.FC = () => {
  const {
    ethPrice,
    calculateFee,
    payFee,
    getAllTransactions,
    isLoading
  } = useChainlinkContracts();

  const [ethAmount, setEthAmount] = useState<string>('');
  const [feeCalculation, setFeeCalculation] = useState<FeeCalculation | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [calculating, setCalculating] = useState(false);
  const [paying, setPaying] = useState(false);

  // Load transactions on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      const txs = await getAllTransactions();
      setTransactions(txs);
    };
    loadTransactions();
  }, [getAllTransactions]);

  // Calculate fee when ETH amount changes
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
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

    return () => clearTimeout(debounceTimer);
  }, [ethAmount, calculateFee]);

  const handlePayFee = async () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) return;
    
    setPaying(true);
    try {
      const success = await payFee(ethAmount);
      if (success) {
        // Reload transactions
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

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
      render: (address: string) => (
        <Text code style={{ fontSize: '12px' }}>
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </Text>
      ),
    },
    {
      title: 'Số tiền ETH',
      dataIndex: 'amountETH',
      key: 'amountETH',
      render: (amount: string) => (
        <Text strong>{parseFloat(amount).toFixed(4)} ETH</Text>
      ),
    },
    {
      title: 'Giá trị USD',
      dataIndex: 'amountUSD',
      key: 'amountUSD',
      render: (amount: string) => (
        <Text>${parseFloat(amount).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Phí ETH',
      dataIndex: 'feeETH',
      key: 'feeETH',
      render: (fee: string) => (
        <Text type="warning">{parseFloat(fee).toFixed(6)} ETH</Text>
      ),
    },
    {
      title: 'Phí USD',
      dataIndex: 'feeUSD',
      key: 'feeUSD',
      render: (fee: string) => (
        <Text type="warning">${parseFloat(fee).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => (
        <Text>{new Date(parseInt(timestamp) * 1000).toLocaleString('vi-VN')}</Text>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <LineChartOutlined /> Dynamic Pricing với Chainlink Oracle
      </Title>
      
      <Row gutter={[24, 24]}>
        {/* Price Display */}
        <Col xs={24} lg={8}>
          <Card>
            <Statistic
              title="Giá ETH/USD hiện tại"
              value={parseFloat(ethPrice)}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Cập nhật từ Chainlink Oracle
            </Text>
          </Card>
        </Col>

        {/* Fee Calculator */}
        <Col xs={24} lg={16}>
          <Card title={<><CalculatorOutlined /> Calculator Phí Giao Dịch</>}>
            <Space.Compact style={{ width: '100%', marginBottom: '16px' }}>
              <Input
                placeholder="Nhập số ETH"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
                suffix="ETH"
                style={{ width: '70%' }}
              />
              <Button
                type="primary"
                onClick={handlePayFee}
                loading={paying}
                disabled={!feeCalculation || parseFloat(ethAmount) <= 0}
                style={{ width: '30%' }}
              >
                Thanh toán phí
              </Button>
            </Space.Compact>

            {calculating && (
              <Text type="secondary">Đang tính toán phí...</Text>
            )}

            {feeCalculation && (
              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                    <Statistic
                      title="Phí ETH (2%)"
                      value={parseFloat(feeCalculation.feeETH)}
                      precision={6}
                      suffix="ETH"
                      valueStyle={{ color: '#52c41a', fontSize: '16px' }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" style={{ background: '#fff7e6', border: '1px solid #ffd591' }}>
                    <Statistic
                      title="Phí USD"
                      value={parseFloat(feeCalculation.feeUSD)}
                      precision={2}
                      prefix="$"
                      valueStyle={{ color: '#fa8c16', fontSize: '16px' }}
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
        style={{ marginTop: '24px' }}
        extra={
          <Button 
            type="link" 
            onClick={async () => {
              const txs = await getAllTransactions();
              setTransactions(txs);
            }}
          >
            Làm mới
          </Button>
        }
      >
        <Table
          dataSource={transactions}
          columns={columns}
          rowKey={(record) => `${record.user}-${record.timestamp}`}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} giao dịch`,
          }}
          loading={isLoading}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
}; 