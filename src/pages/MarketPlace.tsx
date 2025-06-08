import React, { useEffect, useState } from 'react';
import { Row, Col, message, Divider } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NFTItem } from '../types';
import { NFTCard } from '../components/NFTCard';
import { useNFTContract } from '../hooks/useNFTContract';
import { MESSAGES, COLORS } from '../constants';
import { parseWei } from '../utils/web3';
import { LoadingOverlay } from '../components/loading/LoadingOverlay';
import { ContentLoading } from '../components/loading/ContentLoading';

const Marketplace: React.FC = () => {
  // State
  const [myListedNFTs, setMyListedNFTs] = useState<NFTItem[]>([]);
  const [otherListedNFTs, setOtherListedNFTs] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // Custom hook cho tương tác với smart contract
  const { getListedNFTs, buyNFT, isConnected } = useNFTContract();

  // Lấy danh sách NFT đang được bán
  const fetchListedNFTs = async () => {
    try {
      setLoading(true);
      const { myNFTs, otherNFTs } = await getListedNFTs();
      setMyListedNFTs(myNFTs);
      setOtherListedNFTs(otherNFTs);
    } catch (err: any) {
      message.error(MESSAGES.LOAD_FAILED + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý mua NFT
  const handleBuyNFT = async (nft: NFTItem) => {
    if (!nft.listingId || !nft.price) return;

    try {
      setPageLoading(true);
      await buyNFT(nft.listingId, parseWei(nft.price));
      message.success(MESSAGES.BUY_SUCCESS);
      fetchListedNFTs();
    } catch (err: any) {
      message.error(MESSAGES.BUY_FAILED + (err.message || err));
    } finally {
      setPageLoading(false);
    }
  };

  // Effect để load NFTs khi kết nối thay đổi
  useEffect(() => {
    if (isConnected) {
      fetchListedNFTs();
    } else {
      setMyListedNFTs([]);
      setOtherListedNFTs([]);
    }
  }, [isConnected]);

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
          <ConnectButton />
        </div>

        {loading ? (
          <ContentLoading height={400} tip="Đang tải danh sách NFT..." />
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
                    <NFTCard
                      nft={nft}
                      showStatus
                      customAction={
                        <div
                          style={{
                            padding: '16px 0',
                            color: COLORS.SUCCESS,
                            fontWeight: 'bold'
                          }}
                        >
                          ĐANG BÁN ({nft.price} ETH)
                        </div>
                      }
                    />
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
              Cửa hàng NFT
            </Divider>

            <Row gutter={[16, 16]}>
              {otherListedNFTs.length > 0 ? (
                otherListedNFTs.map((nft) => (
                  <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={6}>
                    <NFTCard nft={nft} onBuy={() => handleBuyNFT(nft)} />
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <p>Không có NFT nào có thể mua.</p>
                </Col>
              )}
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default Marketplace;
