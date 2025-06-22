import React, { useState } from 'react';
import { Card, Button, Tag, Row, Col, Typography, Space, Divider, Statistic } from 'antd';
import { StarOutlined, ReloadOutlined, TrophyOutlined } from '@ant-design/icons';
import { generateRandomRarity, generateRandomAttributes, RARITY_CONFIG } from '../utils/web3';
import { RarityVerification } from '../components/chainlinkComponents/RarityVerification';

const { Title, Text } = Typography;

export const Rarity: React.FC = () => {
  const [currentRarity, setCurrentRarity] = useState<ReturnType<typeof generateRandomRarity> | null>(null);
  const [currentAttributes, setCurrentAttributes] = useState<Array<{ trait_type: string; value: string }>>([]);
  const [generationCount, setGenerationCount] = useState(0);

  const handleGenerate = () => {
    const rarity = generateRandomRarity();
    const attributes = generateRandomAttributes(rarity);

    setCurrentRarity(rarity);
    setCurrentAttributes(attributes);
    setGenerationCount((prev) => prev + 1);
  };

  // Statistics về rarity tiers
  const rarityTierStats = Object.entries(RARITY_CONFIG).map(([tier, config]) => ({
    tier,
    ...config,
    dropRate: `${config.percentage}%`
  }));

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={1}>
            <StarOutlined /> Hệ thống Độ hiếm NFT
          </Title>
          <Text style={{ fontSize: 16, color: '#666' }}>Khám phá và test hệ thống tạo độ hiếm ngẫu nhiên</Text>
        </div>

        {/* Random Generator Demo */}
        <Card title="🎲 Random Generator Demo" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={24} style={{ textAlign: 'center', marginBottom: 16 }}>
              <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={handleGenerate}>
                Tạo ngẫu nhiên NFT Properties
              </Button>
              {generationCount > 0 && (
                <Text style={{ marginLeft: 16, color: '#666' }}>Đã tạo: {generationCount} lần</Text>
              )}
            </Col>

            {currentRarity && (
              <Col xs={24} md={12}>
                <Card
                  size="small"
                  title={
                    <>
                      <StarOutlined /> Độ hiếm
                    </>
                  }
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Tag color={currentRarity.color} style={{ fontSize: 14, padding: '4px 12px' }}>
                      {currentRarity.tier}
                    </Tag>
                    <Statistic
                      title="Rarity Score"
                      value={currentRarity.score}
                      suffix="/ 10000"
                      valueStyle={{ color: currentRarity.color }}
                    />
                    <Text style={{ fontSize: 12 }}>Drop Rate: {currentRarity.percentage}%</Text>
                  </Space>
                </Card>
              </Col>
            )}

            {currentAttributes.length > 0 && (
              <Col xs={24} md={12}>
                <Card size="small" title="🎨 Attributes">
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {currentAttributes.map((attr, index) => (
                      <div key={index}>
                        <Text strong>{attr.trait_type}:</Text>
                        <Tag style={{ marginLeft: 8 }}>{attr.value}</Tag>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
            )}
          </Row>
        </Card>

        {/* Rarity Tiers Reference */}
        <Card
          title={
            <>
              <TrophyOutlined /> Bảng Độ hiếm
            </>
          }
        >
          <Row gutter={[16, 16]}>
            {rarityTierStats.map((tier) => (
              <Col xs={24} sm={12} md={8} lg={6} key={tier.tier}>
                <Card
                  size="small"
                  style={{
                    borderColor: tier.color,
                    borderWidth: 2
                  }}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
                    <Tag color={tier.color} style={{ fontSize: 14, padding: '4px 12px' }}>
                      {tier.tier}
                    </Tag>
                    <Text style={{ fontSize: 12 }}>
                      Score: {tier.score[0]} - {tier.score[1]}
                    </Text>
                    <Text style={{ fontSize: 12, color: tier.color }}>Drop: {tier.dropRate}</Text>
                    <Text style={{ fontSize: 12 }}>Price: {tier.multiplier}x</Text>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        <Divider />

        <RarityVerification />
      </Space>
    </div>
  );
};

export default Rarity;
