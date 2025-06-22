import React, { useState, useEffect, useMemo } from 'react';
import { Card, Input, Button, Table, Typography, Tag, Row, Col, Form, Select } from 'antd';
import { StarOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useChainlinkContracts } from '../../hooks/useChainlinkContracts';
import { RARITY_TIERS } from '../../constants';
import type { NFTRarity } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

// ES6 Utility functions với arrow functions
const formatAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const formatDate = (timestamp) => new Date(parseInt(timestamp) * 1000).toLocaleString('vi-VN');

// ES6 const array
const COMMON_TRAITS = ['Background', 'Body', 'Eyes', 'Mouth', 'Hat', 'Clothing', 'Accessories', 'Special'];

interface FormValues {
  nftAddress: string;
  tokenId: string;
}

export const RarityVerification = () => {
  const { requestRarityVerification, getAllRarities, isLoading } = useChainlinkContracts();
  
  const [form] = Form.useForm<FormValues>();
  const [allRarities, setAllRarities] = useState<NFTRarity[]>([]);
  const [requesting, setRequesting] = useState(false);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  useEffect(() => {
    getAllRarities().then(setAllRarities);
  }, [getAllRarities]);

  // ES6 computed statistics với array methods
  const rarityStats = useMemo(() => {
    const total = allRarities.length;
    if (total === 0) return null;

    const tierCounts = Object.values(RARITY_TIERS).reduce((acc, tier) => {
      acc[tier.name] = allRarities.filter(r => r.rarityTier === tier.name).length;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      tierCounts,
      averageScore: Math.round(allRarities.reduce((sum, r) => sum + (r.rarityScore || 0), 0) / total),
      highestScore: Math.max(...allRarities.map(r => r.rarityScore || 0))
    };
  }, [allRarities]);

  const handleSubmit = async (values: FormValues) => {
    if (selectedTraits.length === 0) return;
    
    setRequesting(true);
    try {
      const success = await requestRarityVerification(
        values.nftAddress,
        values.tokenId,
        selectedTraits
      );
      
      if (success) {
        form.resetFields();
        setSelectedTraits([]);
        setTimeout(() => getAllRarities().then(setAllRarities), 2000);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setRequesting(false);
    }
  };

  const handleTraitAdd = (trait: string) => {
    if (trait && !selectedTraits.includes(trait)) {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  const handleTraitRemove = (trait: string) => {
    setSelectedTraits(selectedTraits.filter(t => t !== trait));
  };

  const getRarityInfo = (tier: string) => {
    return Object.values(RARITY_TIERS).find(t => t.name === tier) || RARITY_TIERS.COMMON;
  };

  const columns = [
    {
      title: 'NFT',
      dataIndex: 'nftAddress',
      key: 'nftAddress',
      render: (address: string, record: NFTRarity) => (
        <div>
          <Text code style={{ fontSize: 12 }}>{formatAddress(address)}</Text>
          <br />
          <Text strong>#{record.tokenId}</Text>
        </div>
      ),
    },
    {
      title: 'Độ hiếm',
      key: 'rarity',
      render: (record: NFTRarity) => {
        const info = getRarityInfo(record.rarityTier);
        return (
          <div>
            <Tag color={info.color}>
              <StarOutlined /> {record.rarityTier}
            </Tag>
            <br />
            <Text style={{ fontSize: 12, color: info.color }}>
              {record.rarityScore}/10000
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Đặc điểm',
      dataIndex: 'traits',
      key: 'traits',
      render: (traits: string[]) => (
        <div>
          {traits.slice(0, 2).map((trait, i) => (
            <Tag key={i} size="small">{trait}</Tag>
          ))}
          {traits.length > 2 && <Tag size="small">+{traits.length - 2}</Tag>}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified: boolean) => (
        <Tag color={isVerified ? 'success' : 'processing'}>
          {isVerified ? (
            <><CheckCircleOutlined /> Đã xác minh</>
          ) : (
            <><LoadingOutlined /> Đang xử lý</>
          )}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        <StarOutlined /> Xác minh Độ hiếm NFT
      </Title>
      
      {/* Thêm Rarity Statistics */}
      {rarityStats && (
        <Card title="📊 Thống kê độ hiếm" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                  {rarityStats.total}
                </Title>
                <Text>Tổng NFT</Text>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                  {rarityStats.averageScore}
                </Title>
                <Text>Điểm TB</Text>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ margin: 0, color: '#fa8c16' }}>
                  {rarityStats.highestScore}
                </Title>
                <Text>Điểm cao nhất</Text>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <div style={{ textAlign: 'center' }}>
                {Object.entries(rarityStats.tierCounts).map(([tier, count]) => (
                  <div key={tier} style={{ marginBottom: 4 }}>
                    <Tag color={getRarityInfo(tier).color} size="small">
                      {tier}: {count}
                    </Tag>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Card>
      )}
      
      <Row gutter={[24, 24]}>
        {/* Form */}
        <Col xs={24} lg={12}>
          <Card title="🎭 Yêu cầu xác minh">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Địa chỉ NFT Contract"
                name="nftAddress"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ!' },
                  { pattern: /^0x[a-fA-F0-9]{40}$/, message: 'Địa chỉ không hợp lệ!' }
                ]}
              >
                <Input placeholder="0x..." />
              </Form.Item>

              <Form.Item
                label="Token ID"
                name="tokenId"
                rules={[
                  { required: true, message: 'Vui lòng nhập Token ID!' },
                  { pattern: /^\d+$/, message: 'Token ID phải là số!' }
                ]}
              >
                <Input placeholder="1" />
              </Form.Item>

              <Form.Item label="Đặc điểm">
                <Select
                  placeholder="Chọn đặc điểm"
                  onSelect={handleTraitAdd}
                  value={undefined}
                >
                  {COMMON_TRAITS.map(trait => (
                    <Option key={trait} value={trait}>{trait}</Option>
                  ))}
                </Select>
                
                {selectedTraits.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {selectedTraits.map((trait, i) => (
                      <Tag
                        key={i}
                        closable
                        onClose={() => handleTraitRemove(trait)}
                        style={{ marginBottom: 4 }}
                      >
                        {trait}
                      </Tag>
                    ))}
                  </div>
                )}
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={requesting}
                  disabled={selectedTraits.length === 0}
                  block
                >
                  Yêu cầu xác minh
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Rarity Tiers */}
        <Col xs={24} lg={12}>
          <Card title="🏆 Bảng xếp hạng">
            <Row gutter={[8, 8]}>
              {Object.values(RARITY_TIERS).map((tier, i) => (
                <Col xs={12} sm={8} key={i}>
                  <Card 
                    size="small" 
                    style={{ 
                      background: `${tier.color}15`, 
                      border: `1px solid ${tier.color}40`,
                      textAlign: 'center'
                    }}
                  >
                    <StarOutlined style={{ color: tier.color, fontSize: 16 }} />
                    <br />
                    <Text strong style={{ color: tier.color, fontSize: 12 }}>
                      {tier.name}
                    </Text>
                    <br />
                    <Text style={{ fontSize: 10 }}>
                      {tier.minScore}-{tier.maxScore}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card 
        title="📋 NFT đã xác minh" 
        style={{ marginTop: 24 }}
        extra={
          <Button 
            type="link" 
            onClick={() => getAllRarities().then(setAllRarities)}
          >
            Làm mới
          </Button>
        }
      >
        <Table
          dataSource={allRarities}
          columns={columns}
          rowKey={(record) => `${record.nftAddress}-${record.tokenId}`}
          pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} NFT` }}
          loading={isLoading}
          size="small"
          scroll={{ x: 600 }}
        />

        {allRarities.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Text type="secondary">Chưa có NFT nào được xác minh</Text>
          </div>
        )}
      </Card>
    </div>
  );
}; 