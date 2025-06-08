import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, Button, Spin, Alert, Tag, Select } from 'antd';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useUserNFTs, useResyncNFTMetadata } from '../../hooks/useMoralis';
import { useMoralisContext } from '../../providers/MoralisProvider';
import { MoralisStatus } from './MoralisStatus';
import { IPFSImage } from './IPFSImage';
import { getChainName } from '../../config/moralis';

const { Meta } = Card;

export const MoralisNFTDemo: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState(11155111); // Default to Sepolia
  const { address } = useAccount();
  const { isInitialized, isLoading: moralisLoading, error: moralisError, retry } = useMoralisContext();
  const { data, isLoading, error, refetch } = useUserNFTs(address, selectedChain, { enabled: isInitialized });
  const resyncMutation = useResyncNFTMetadata();

  const handleResync = (tokenAddress: string, tokenId: string) => {
    resyncMutation.mutate({ tokenAddress, tokenId, chainId: selectedChain });
  };

  const supportedChains = [
    { value: 11155111, label: '🔧 Sepolia Testnet' },
    { value: 1, label: '🔷 Ethereum Mainnet' },
    { value: 137, label: '🔮 Polygon' },
    { value: 56, label: '🟡 BSC' }
  ];

  // Show Moralis initialization status
  if (moralisLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>🚀 Đang khởi tạo Moralis...</p>
      </div>
    );
  }

  if (moralisError) {
    return (
      <Alert
        message="⚙️ Cấu hình Moralis API Key"
        description={
          <div>
            <strong>Lỗi:</strong> {moralisError}
          </div>
        }
        type="error"
        showIcon
        action={<Button onClick={retry}>Thử lại</Button>}
      />
    );
  }

  if (!address) {
    return (
      <Alert
        message="🔗 Kết nối Wallet"
        description="Vui lòng kết nối wallet để xem NFTs của bạn"
        type="info"
        showIcon
      />
    );
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>🔍 Đang tải NFTs từ Moralis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="❌ Lỗi tải dữ liệu"
        description={error.message}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => refetch()}>
            Thử lại
          </Button>
        }
      />
    );
  }

  const nfts = data?.nfts || [];

  return (
    <div style={{ padding: '20px' }}>
      {/* Debug Status */}
      <MoralisStatus />

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🖼️ NFT Gallery - Powered by Moralis</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Select value={selectedChain} onChange={setSelectedChain} style={{ width: 200 }} options={supportedChains} />
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} type="primary">
            Refresh
          </Button>
        </div>
      </div>

      {nfts.length === 0 ? (
        <Alert
          message="📭 Không có NFTs"
          description={
            <div>
              <p>Wallet này chưa có NFTs nào trên {getChainName(selectedChain)}.</p>
              {selectedChain === 11155111 && (
                <p style={{ marginTop: '10px' }}>
                  <strong>Đối với Sepolia testnet:</strong>
                  <br />• NFTs có thể mất vài phút để sync sau khi mint
                  <br />• Thử refresh lại sau 2-3 phút
                  <br />• Đảm bảo wallet đang connect đúng Sepolia network
                </p>
              )}
            </div>
          }
          type="info"
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}
        >
          {nfts.map((nft, index) => (
            <Card
              key={`${nft.tokenAddress || 'unknown'}-${nft.tokenId || index}`}
              hoverable
              style={{ width: '100%' }}
              cover={
                nft.image && (
                  <IPFSImage
                    alt={nft.name}
                    src={nft.image}
                    style={{ height: 200, objectFit: 'cover' }}
                    preview={false}
                  />
                )
              }
              actions={[
                <Button
                  key="view"
                  icon={<EyeOutlined />}
                  type="link"
                  onClick={() => window.open(nft.externalUrl || '#', '_blank')}
                >
                  Xem chi tiết
                </Button>,
                <Button
                  key="resync"
                  icon={<ReloadOutlined />}
                  type="link"
                  loading={resyncMutation.isPending}
                  onClick={() => handleResync(nft.tokenAddress, nft.tokenId)}
                >
                  Resync
                </Button>
              ]}
            >
              <Meta
                title={
                  <div>
                    {nft.name}
                    {nft.isVerified && (
                      <Tag color="blue" style={{ marginLeft: 8 }}>
                        ✓ Verified
                      </Tag>
                    )}
                    {nft.isSpam && (
                      <Tag color="red" style={{ marginLeft: 8 }}>
                        ⚠️ Spam
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <div>
                    <p
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {nft.description || 'Không có mô tả'}
                    </p>
                    <div style={{ marginTop: 10 }}>
                      <Tag color="green">{nft.collectionName}</Tag>
                      <Tag color="purple">#{nft.tokenId}</Tag>
                      <Tag color="blue">{getChainName(selectedChain)}</Tag>
                    </div>
                    {nft.attributes.length > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>Attributes:</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {nft.attributes.slice(0, 3).map((attr, index) => (
                            <Tag key={index} color="default" style={{ fontSize: '10px' }}>
                              {attr.trait_type}: {attr.value}
                            </Tag>
                          ))}
                          {nft.attributes.length > 3 && (
                            <Tag color="default" style={{ fontSize: '10px' }}>
                              +{nft.attributes.length - 3} more
                            </Tag>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>
          📊 Hiển thị {nfts.length} NFTs trên {getChainName(selectedChain)} | Powered by Moralis Web3 API
        </p>
        {nfts.length === 0 && selectedChain === 11155111 && (
          <div style={{ color: '#999', fontSize: '14px', marginTop: '10px' }}>
            <p>
              🔧 <strong>Troubleshooting cho Sepolia:</strong>
            </p>
            <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
              <li>Đảm bảo wallet connect đúng Sepolia network</li>
              <li>NFTs mới mint có thể mất 5-10 phút để hiển thị</li>
              <li>
                Kiểm tra transaction đã confirm chưa trên{' '}
                <a href="https://sepolia.etherscan.io" target="_blank">
                  Sepolia Etherscan
                </a>
              </li>
              <li>Thử resync metadata bằng button "Resync" nếu NFT xuất hiện</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
