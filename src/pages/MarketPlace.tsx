import React, { useEffect, useState } from 'react';
import { Row, Col, message, Divider, Select, Card, Button, Tag, Alert, Spin } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { NFTItem } from '../types';
import { NFTCard } from '../components/NFTCard';
import { useNFTContract } from '../hooks/useNFTContract';
import { MESSAGES, COLORS } from '../constants';
import { parseWei } from '../utils/web3';
import { LoadingOverlay } from '../components/loading/LoadingOverlay';
import { ContentLoading } from '../components/loading/ContentLoading';
import { useAccount, usePublicClient } from 'wagmi';
import { useUserNFTs, useResyncNFTMetadata, useNFTDetails } from '../hooks/useMoralis';
import { useMoralisContext } from '../providers/MoralisProvider';
import { IPFSImage } from '../components/moralisComponents/IPFSImage';
import { MoralisStatus } from '../components/moralisComponents/MoralisStatus';
import { getChainName } from '../config/moralis';
import { ProcessedNFT } from '../types/nft';
import MarketPlaceABI from '../abis/MarketPlace.json';

const { Meta } = Card;

const Marketplace: React.FC = () => {
  // State
  const [myListedNFTs, setMyListedNFTs] = useState<NFTItem[]>([]);
  const [otherListedNFTs, setOtherListedNFTs] = useState<NFTItem[]>([]);
  const [myNFTs, setMyNFTs] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedChain, setSelectedChain] = useState(11155111); // Default to Sepolia

  // Custom hook cho tương tác với smart contract
  const { buyNFT, listNFT, isConnected, contractAddress, marketplaceAddress } = useNFTContract();
  const publicClient = usePublicClient();

  // Moralis hooks
  const { address } = useAccount();
  const { isInitialized, isLoading: moralisLoading, error: moralisError, retry } = useMoralisContext();
  const {
    data: moralisData,
    isLoading: nftsLoading,
    error: nftsError,
    refetch
  } = useUserNFTs(address, selectedChain, {
    enabled: isInitialized && isConnected
  });
  const resyncMutation = useResyncNFTMetadata();

  // Xử lý resync metadata
  const handleResync = (tokenAddress: string, tokenId: string) => {
    resyncMutation.mutate({ tokenAddress, tokenId, chainId: selectedChain });
  };

  // Xử lý mua NFT
  const handleBuyNFT = async (nft: NFTItem) => {
    if (!nft.listingId || !nft.price) return;

    try {
      setPageLoading(true);
      await buyNFT(nft.listingId, parseWei(nft.price));
      message.success(MESSAGES.BUY_SUCCESS);
      refetch();
    } catch (err: any) {
      message.error(MESSAGES.BUY_FAILED + (err.message || err));
    } finally {
      setPageLoading(false);
    }
  };

  // Xử lý list NFT lên marketplace
  const handleListNFT = async (nft: NFTItem, price: string) => {
    if (!price || isNaN(Number(price))) {
      message.error(MESSAGES.INVALID_PRICE);
      return;
    }

    try {
      setPageLoading(true);
      await listNFT(nft.tokenId, parseWei(price));
      message.success(MESSAGES.LIST_SUCCESS);
      refetch();
    } catch (err: any) {
      message.error(MESSAGES.LIST_FAILED + (err.message || err));
    } finally {
      setPageLoading(false);
    }
  };

  // Chuyển đổi dữ liệu Moralis sang định dạng NFTItem
  const processNFTsFromMoralis = async () => {
    if (!moralisData?.nfts || !contractAddress) {
      return { myNFTs: [], otherNFTs: [] };
    }

    const processedMyNFTs: NFTItem[] = [];
    const processedOtherNFTs: NFTItem[] = [];
    const processedMyListedNFTs: NFTItem[] = [];

    try {
      setLoading(true);

      // Lấy thông tin listing từ contract
      const listings = await getListingsFromContract();

      for (const nft of moralisData.nfts) {
        // Chỉ xử lý NFT từ contract của chúng ta
        if (nft.tokenAddress.toLowerCase() !== contractAddress.toLowerCase()) {
          continue;
        }

        // Tìm thông tin listing nếu có
        const listing = listings.find((l) => l.tokenId === BigInt(nft.tokenId) && !l.isSold);

        const nftItem: NFTItem = {
          tokenId: Number(nft.tokenId),
          name: nft.name || 'Unnamed NFT',
          description: nft.description || 'No description',
          image: nft.image,
          owner: nft.owner,
          isListed: !!listing,
          price: listing ? (Number(listing.price) / 1e18).toString() : undefined,
          listingId: listing ? listings.indexOf(listing) : undefined
        };

        // Phân loại NFT dựa trên owner và trạng thái listing
        if (listing) {
          if (listing.seller.toLowerCase() === address?.toLowerCase()) {
            processedMyListedNFTs.push(nftItem);
          } else {
            processedOtherNFTs.push(nftItem);
          }
        } else if (nft.owner.toLowerCase() === address?.toLowerCase()) {
          processedMyNFTs.push(nftItem);
        }
      }

      console.log('📊 Kết quả xử lý:', {
        myNFTs: processedMyNFTs.length,
        myListedNFTs: processedMyListedNFTs.length,
        otherListedNFTs: processedOtherNFTs.length
      });

      // Cập nhật state
      setMyNFTs(processedMyNFTs);
      setMyListedNFTs(processedMyListedNFTs);
      setOtherListedNFTs(processedOtherNFTs);

      return { myNFTs: processedMyNFTs, otherNFTs: processedOtherNFTs };
    } catch (error) {
      console.error('❌ Error processing NFTs:', error);
      return { myNFTs: [], otherNFTs: [] };
    } finally {
      setLoading(false);
    }
  };

  // Lấy thông tin listing từ contract
  const getListingsFromContract = async () => {
    if (!marketplaceAddress || !publicClient) {
      return [];
    }

    try {
      console.log('🔄 Đang lấy listings từ contract:', marketplaceAddress);

      const listings = (await publicClient.readContract({
        address: marketplaceAddress as `0x${string}`,
        abi: MarketPlaceABI,
        functionName: 'getListings'
      })) as { seller: string; nftAddress: string; tokenId: bigint; price: bigint; isSold: boolean }[];

      console.log('✅ Lấy listings thành công:', listings);
      return listings || [];
    } catch (error) {
      console.error('❌ Error fetching listings from contract:', error);
      return [];
    }
  };

  // Effect để load NFTs khi kết nối thay đổi
  useEffect(() => {
    if (isConnected && isInitialized && address) {
      console.log('✅ Điều kiện thỏa mãn, gọi processNFTsFromMoralis');
      processNFTsFromMoralis();
    } else {
      setMyListedNFTs([]);
      setOtherListedNFTs([]);
      setMyNFTs([]);
    }
  }, [isConnected, isInitialized, selectedChain, address, moralisData]);

  const supportedChains = [
    { value: 11155111, label: '🔧 Sepolia Testnet' },
    { value: 1, label: '🔷 Ethereum Mainnet' },
    { value: 137, label: '🔮 Polygon' },
    { value: 56, label: '🟡 BSC' }
  ];

  // Xử lý hiển thị khi đang khởi tạo Moralis
  if (moralisLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>🚀 Đang khởi tạo Moralis...</p>
      </div>
    );
  }

  // Xử lý hiển thị khi có lỗi Moralis
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

  // Xử lý hiển thị khi chưa kết nối wallet
  if (!address) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2>Marketplace</h2>
          <ConnectButton />
        </div>
        <Alert
          message="🔗 Kết nối Wallet"
          description="Vui lòng kết nối wallet để xem NFTs của bạn"
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <>
      {pageLoading && <LoadingOverlay />}
      <div style={{ padding: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 24
          }}
        >
          <h2>Marketplace</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Select
              value={selectedChain}
              onChange={setSelectedChain}
              style={{ width: 200 }}
              options={supportedChains}
            />
            <Button icon={<ReloadOutlined />} onClick={() => refetch()} type="primary">
              Refresh
            </Button>
            <ConnectButton />
          </div>
        </div>

        {/* Debug Status */}
        <MoralisStatus />

        {loading || nftsLoading ? (
          <ContentLoading height={400} tip="Đang tải danh sách NFT..." />
        ) : nftsError ? (
          <Alert
            message="❌ Lỗi tải dữ liệu"
            description={nftsError.message}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          />
        ) : (
          <>
            <Divider
              style={{
                borderColor: COLORS.BORDER,
                margin: '30px 0',
                fontSize: 22
              }}
            >
              NFT của bạn (Đang bán)
            </Divider>

            <Row gutter={[16, 16]}>
              {myListedNFTs.length > 0 ? (
                myListedNFTs.map((nft) => (
                  <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      style={{ width: '100%' }}
                      cover={
                        <IPFSImage
                          alt={nft.name}
                          src={nft.image}
                          style={{ height: 200, objectFit: 'cover' }}
                          preview={false}
                        />
                      }
                    >
                      <Meta
                        title={nft.name}
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
                              {nft.description}
                            </p>
                            <div style={{ marginTop: 10 }}>
                              <Tag color="purple">#{nft.tokenId}</Tag>
                              <Tag color="blue">{getChainName(selectedChain)}</Tag>
                            </div>
                            <div
                              style={{
                                padding: '16px 0',
                                color: COLORS.SUCCESS,
                                fontWeight: 'bold'
                              }}
                            >
                              ĐANG BÁN ({nft.price} ETH)
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <p>Chưa có NFT nào bạn đã list.</p>
                </Col>
              )}
            </Row>

            <Divider
              style={{
                borderColor: COLORS.BORDER,
                margin: '30px 0',
                fontSize: 22
              }}
            >
              NFT của bạn
            </Divider>

            <Row gutter={[16, 16]}>
              {myNFTs.length > 0 ? (
                myNFTs.map((nft) => (
                  <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      style={{ width: '100%' }}
                      cover={
                        <IPFSImage
                          alt={nft.name}
                          src={nft.image}
                          style={{ height: 200, objectFit: 'cover' }}
                          preview={false}
                        />
                      }
                      actions={[
                        <Button
                          key="resync"
                          icon={<ReloadOutlined />}
                          type="link"
                          loading={resyncMutation.isPending}
                          onClick={() => handleResync(contractAddress, nft.tokenId.toString())}
                        >
                          Resync
                        </Button>
                      ]}
                    >
                      <Meta
                        title={nft.name}
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
                              {nft.description}
                            </p>
                            <div style={{ marginTop: 10 }}>
                              <Tag color="purple">#{nft.tokenId}</Tag>
                              <Tag color="blue">{getChainName(selectedChain)}</Tag>
                            </div>
                            <div style={{ marginTop: 16 }}>
                              <input
                                placeholder="Giá (ETH)"
                                onChange={(e) => (nft.price = e.target.value)}
                                style={{ width: '100%', marginBottom: 8, padding: '8px' }}
                              />
                              <Button
                                type="primary"
                                onClick={() => handleListNFT(nft, nft.price || '')}
                                style={{ width: '100%' }}
                              >
                                List vào Marketplace
                              </Button>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <p>Bạn chưa có NFT nào.</p>
                </Col>
              )}
            </Row>

            <Divider
              style={{
                borderColor: COLORS.BORDER,
                margin: '30px 0',
                fontSize: 22
              }}
            >
              Cửa hàng NFT
            </Divider>

            <Row gutter={[16, 16]}>
              {otherListedNFTs.length > 0 ? (
                otherListedNFTs.map((nft) => (
                  <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      style={{ width: '100%' }}
                      cover={
                        <IPFSImage
                          alt={nft.name}
                          src={nft.image}
                          style={{ height: 200, objectFit: 'cover' }}
                          preview={false}
                        />
                      }
                      actions={[
                        <Button key="buy" type="primary" onClick={() => handleBuyNFT(nft)}>
                          Mua ({nft.price} ETH)
                        </Button>
                      ]}
                    >
                      <Meta
                        title={nft.name}
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
                              {nft.description}
                            </p>
                            <div style={{ marginTop: 10 }}>
                              <Tag color="purple">#{nft.tokenId}</Tag>
                              <Tag color="blue">{getChainName(selectedChain)}</Tag>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <p>Không có NFT nào có thể mua.</p>
                </Col>
              )}
            </Row>

            {/* Thông tin bổ sung */}
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <p style={{ color: '#666' }}>📊 Powered by Moralis Web3 API | Chain: {getChainName(selectedChain)}</p>
              {moralisData?.nfts?.length === 0 && selectedChain === 11155111 && (
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
                    <li>Thử resync metadata bằng button "Resync"</li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Marketplace;
