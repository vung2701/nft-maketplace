import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Table, Typography, Space, Tag, Row, Col, Form, Select, Progress } from 'antd';
import { StarOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useChainlinkContracts } from '../../hooks/useChainlinkContracts';
import { RARITY_TIERS } from '../../constants';
import type { NFTRarity } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;

interface RarityRequestForm {
  nftAddress: string;
  tokenId: string;
  traits: string[];
}

export const RarityVerification: React.FC = () => {
  const {
    requestRarityVerification,
    getNFTRarity,
    getAllRarities,
    isLoading
  } = useChainlinkContracts();

  const [form] = Form.useForm<RarityRequestForm>();
  const [allRarities, setAllRarities] = useState<NFTRarity[]>([]);
  const [requesting, setRequesting] = useState(false);
  const [currentTraits, setCurrentTraits] = useState<string[]>([]);

  // Load all rarities on component mount
  useEffect(() => {
    const loadRarities = async () => {
      const rarities = await getAllRarities();
      setAllRarities(rarities);
    };
    loadRarities();
  }, [getAllRarities]);

  const handleRequestVerification = async (values: RarityRequestForm) => {
    setRequesting(true);
    try {
      const success = await requestRarityVerification(
        values.nftAddress,
        values.tokenId,
        values.traits
      );
      
      if (success) {
        form.resetFields();
        setCurrentTraits([]);
        // Reload rarities after a short delay to get the new entry
        setTimeout(async () => {
          const rarities = await getAllRarities();
          setAllRarities(rarities);
        }, 2000);
      }
    } catch (error) {
      console.error('Error requesting verification:', error);
    } finally {
      setRequesting(false);
    }
  };

  const getRarityTierInfo = (tier: string) => {
    const tierInfo = Object.values(RARITY_TIERS).find(t => t.name === tier);
    return tierInfo || RARITY_TIERS.COMMON;
  };

  const getRarityProgress = (score: string) => {
    const scoreNum = parseInt(score);
    return (scoreNum / 10000) * 100;
  };

  const addTrait = (trait: string) => {
    if (trait && !currentTraits.includes(trait)) {
      const newTraits = [...currentTraits, trait];
      setCurrentTraits(newTraits);
      form.setFieldValue('traits', newTraits);
    }
  };

  const removeTrait = (traitToRemove: string) => {
    const newTraits = currentTraits.filter(trait => trait !== traitToRemove);
    setCurrentTraits(newTraits);
    form.setFieldValue('traits', newTraits);
  };

  const columns = [
    {
      title: 'NFT Address',
      dataIndex: 'nftAddress',
      key: 'nftAddress',
      render: (address: string) => (
        <Text code style={{ fontSize: '12px' }}>
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </Text>
      ),
    },
    {
      title: 'Token ID',
      dataIndex: 'tokenId',
      key: 'tokenId',
      width: 100,
      render: (tokenId: string) => (
        <Text strong>#{tokenId}</Text>
      ),
    },
    {
      title: 'Độ hiếm',
      key: 'rarity',
      render: (record: NFTRarity) => {
        const tierInfo = getRarityTierInfo(record.rarityTier);
        const progress = getRarityProgress(record.rarityScore);
        
        return (
          <div>
            <Tag color={tierInfo.color} style={{ marginBottom: '4px' }}>
              <StarOutlined /> {record.rarityTier}
            </Tag>
            <div>
              <Progress 
                percent={progress} 
                size="small" 
                strokeColor={tierInfo.color}
                showInfo={false}
              />
              <Text style={{ fontSize: '12px', color: tierInfo.color }}>
                {record.rarityScore}/10000
              </Text>
            </div>
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
          {traits.slice(0, 3).map((trait, index) => (
            <Tag key={index}>{trait}</Tag>
          ))}
          {traits.length > 3 && (
            <Tag>+{traits.length - 3}</Tag>
          )}
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
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => (
        <Text style={{ fontSize: '12px' }}>
          {new Date(parseInt(timestamp) * 1000).toLocaleString('vi-VN')}
        </Text>
      ),
    },
  ];

  const commonTraits = [
    'Background', 'Body', 'Eyes', 'Mouth', 'Hat', 'Clothing', 
    'Accessories', 'Special', 'Rare', 'Legendary'
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <StarOutlined /> Xác minh Độ hiếm NFT
      </Title>
      
      <Row gutter={[24, 24]}>
        {/* Request Form */}
        <Col xs={24} lg={10}>
          <Card title="🎭 Yêu cầu xác minh độ hiếm">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleRequestVerification}
              initialValues={{ traits: [] }}
            >
              <Form.Item
                label="Địa chỉ NFT Contract"
                name="nftAddress"
                rules={[
                  { required: true, message: 'Vui lòng nhập địa chỉ NFT contract!' },
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

              <Form.Item label="Đặc điểm NFT">
                <Space.Compact style={{ width: '100%' }}>
                  <Select
                    placeholder="Chọn đặc điểm"
                    style={{ width: '70%' }}
                    onSelect={(value: string | undefined) => value && addTrait(value)}
                    value={undefined}
                  >
                    {commonTraits.map(trait => (
                      <Option key={trait} value={trait}>{trait}</Option>
                    ))}
                  </Select>
                  <Input
                    placeholder="Hoặc nhập tùy chỉnh"
                    style={{ width: '30%' }}
                    onPressEnter={(e) => {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        addTrait(value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </Space.Compact>
              </Form.Item>

              {currentTraits.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <Text strong>Đặc điểm đã chọn:</Text>
                  <div style={{ marginTop: '8px' }}>
                    {currentTraits.map((trait, index) => (
                      <Tag
                        key={index}
                        closable
                        onClose={() => removeTrait(trait)}
                        style={{ marginBottom: '4px' }}
                      >
                        {trait}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              <Form.Item name="traits" hidden>
                <Input />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={requesting}
                  disabled={currentTraits.length === 0}
                  block
                >
                  Yêu cầu xác minh độ hiếm
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Rarity Tiers Info */}
        <Col xs={24} lg={14}>
          <Card title="🏆 Bảng xếp hạng độ hiếm">
            <Row gutter={[16, 16]}>
              {Object.values(RARITY_TIERS).map((tier, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card size="small" style={{ 
                    background: `${tier.color}15`, 
                    border: `1px solid ${tier.color}40` 
                  }}>
                    <Space align="center">
                      <StarOutlined style={{ color: tier.color, fontSize: '18px' }} />
                      <div>
                        <Text strong style={{ color: tier.color }}>
                          {tier.name}
                        </Text>
                        <br />
                        <Text style={{ fontSize: '12px' }}>
                          {tier.minScore} - {tier.maxScore}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Rarities Table */}
      <Card 
        title="📋 Danh sách NFT đã xác minh" 
        style={{ marginTop: '24px' }}
        extra={
          <Button 
            type="link" 
            onClick={async () => {
              const rarities = await getAllRarities();
              setAllRarities(rarities);
            }}
          >
            Làm mới
          </Button>
        }
      >
        <Table
          dataSource={allRarities}
          columns={columns}
          rowKey={(record) => `${record.nftAddress}-${record.tokenId}`}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} NFT`,
          }}
          loading={isLoading}
          scroll={{ x: 800 }}
        />

        {allRarities.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="secondary">
              Chưa có NFT nào được xác minh độ hiếm
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
}; 