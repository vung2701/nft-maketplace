import React, { useEffect, useState } from 'react';
import { Row, Col, message, Divider, Spin, Tag } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import { MintForm } from '../components/MintForm';
import { NFTCard } from '../components/NFTCard';
import { NFTItem } from '../types';
import { useNFTContract } from '../hooks/useNFTContract';
import { ROUTES, MESSAGES, COLORS } from '../constants';
import { shortenAddress, parseWei } from '../utils/web3';

export const Home: React.FC = () => {
  // State và hooks
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Custom hook cho tương tác với smart contract
  const { getUserNFTs, listNFT, isConnected } = useNFTContract();

  // Lấy danh sách NFT của user
  const fetchUserNFTs = async () => {
    try {
      setLoading(true);
      const userNFTs = await getUserNFTs();
      setNfts(userNFTs);
    } catch (err: any) {
      message.error(MESSAGES.LOAD_FAILED + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý list NFT
  const handleListNFT = async (tokenId: number, price: string) => {
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return message.error(MESSAGES.INVALID_PRICE);
    }

    try {
      setLoading(true);
      await listNFT(tokenId, parseWei(price));
      message.success(MESSAGES.LIST_SUCCESS);
      await fetchUserNFTs();
      navigate(ROUTES.MARKETPLACE);
    } catch (err: any) {
      message.error(MESSAGES.LIST_FAILED + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Effect để load NFTs khi kết nối thay đổi
  useEffect(() => {
    if (isConnected) {
      fetchUserNFTs();
    } else {
      setNfts([]);
    }
  }, [isConnected]);

  return (
    <div className="homePage">
      <h2>Trang chủ</h2>
      
      <div className="connectButton">
        <ConnectButton />
      </div>

      <MintForm onSuccess={fetchUserNFTs} />

      <Divider 
        style={{ 
          borderColor: COLORS.BORDER, 
          margin: '30px 0', 
          fontSize: 22 
        }}
      >
        NFT của bạn (Chưa được list)
      </Divider>

      {loading ? (
        <Spin size="large" />
      ) : nfts.length > 0 ? (
        <Row gutter={[16, 16]}>
          {nfts.map((nft) => (
            <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={6}>
              <NFTCard
                nft={nft}
                onList={(price) => handleListNFT(nft.tokenId, price)}
                customAction={
                  <Tag color="blue" style={{ marginTop: 10 }}>
                    Owner: {shortenAddress(nft.owner)}
                  </Tag>
                }
                showStatus={true}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <p>Bạn không có NFT nào chưa được list</p>
      )}
    </div>
  );
};
