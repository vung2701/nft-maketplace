import React, { useState } from 'react';
import { Card, Collapse, Tag, Button, Space } from 'antd';
import { EyeOutlined, BugOutlined } from '@ant-design/icons';
import type { ProcessedNFT } from '../../types/nft';
import { getIPFSFallbacks } from '../../config/moralis';

const { Panel } = Collapse;

interface NFTDebugCardProps {
  nft: ProcessedNFT;
}

export const NFTDebugCard: React.FC<NFTDebugCardProps> = ({ nft }) => {
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  const fallbackUrls = getIPFSFallbacks(nft.image);

  return (
    <Card
      size="small"
      title={
        <Space>
          <BugOutlined />
          Debug: {nft.name}
        </Space>
      }
      extra={
        <Button size="small" type="link" onClick={() => setIsDebugOpen(!isDebugOpen)}>
          {isDebugOpen ? 'Hide' : 'Show'} Debug
        </Button>
      }
    >
      {isDebugOpen && (
        <Collapse size="small">
          <Panel header="🖼️ Image URLs" key="images">
            <div style={{ fontSize: '12px' }}>
              <p>
                <strong>Original Image:</strong>
              </p>
              <code style={{ background: '#f5f5f5', padding: '2px 4px', fontSize: '10px' }}>
                {nft.image || 'No image'}
              </code>

              <p style={{ marginTop: '10px' }}>
                <strong>Fallback URLs:</strong>
              </p>
              {fallbackUrls.map((url, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  <Tag color={index === 0 ? 'green' : 'default'}>Gateway {index + 1}</Tag>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '10px', marginLeft: '5px' }}
                  >
                    Test URL
                  </a>
                  <br />
                  <code style={{ fontSize: '9px', color: '#666' }}>{url}</code>
                </div>
              ))}
            </div>
          </Panel>

          <Panel header="📋 Basic Info" key="basic">
            <div style={{ fontSize: '12px' }}>
              <p>
                <strong>Token Address:</strong> {nft.tokenAddress}
              </p>
              <p>
                <strong>Token ID:</strong> {nft.tokenId}
              </p>
              <p>
                <strong>Owner:</strong> {nft.owner}
              </p>
              <p>
                <strong>Chain ID:</strong> {nft.chainId}
              </p>
              <p>
                <strong>Collection:</strong> {nft.collectionName}
              </p>
            </div>
          </Panel>

          <Panel header="🏷️ Status" key="status">
            <div style={{ fontSize: '12px' }}>
              <p>
                <strong>Is Spam:</strong> <Tag color={nft.isSpam ? 'red' : 'green'}>{nft.isSpam ? 'Yes' : 'No'}</Tag>
              </p>
              <p>
                <strong>Is Verified:</strong>{' '}
                <Tag color={nft.isVerified ? 'blue' : 'default'}>{nft.isVerified ? 'Yes' : 'No'}</Tag>
              </p>
              <p>
                <strong>Last Sync:</strong> {nft.lastSync || 'Unknown'}
              </p>
            </div>
          </Panel>

          {nft.attributes.length > 0 && (
            <Panel header="🎨 Attributes" key="attributes">
              <div style={{ fontSize: '12px' }}>
                {nft.attributes.map((attr, index) => (
                  <Tag key={index} style={{ marginBottom: '4px' }}>
                    {attr.trait_type}: {attr.value}
                  </Tag>
                ))}
              </div>
            </Panel>
          )}
        </Collapse>
      )}
    </Card>
  );
};
