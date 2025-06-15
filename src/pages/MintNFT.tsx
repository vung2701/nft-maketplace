import React, { useEffect, useState } from 'react';
import { Row, Col, message, Divider, Tag } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import { NFTItem } from '../types';
import { useNFTContract } from '../hooks/useNFTContract';
import { ROUTES, MESSAGES, COLORS } from '../constants';
import { parseWei } from '../utils/web3';
import { LoadingOverlay } from '../components/loading/LoadingOverlay';
import { MintForm } from '../components/form/MintForm';

export const MintNFT = () => {
  // State và hooks
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
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

  const handleListNFT = async (tokenId: number, price: string) => {
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return message.error(MESSAGES.INVALID_PRICE);
    }

    try {
      setPageLoading(true);
      await listNFT(tokenId, parseWei(price));
      message.success(MESSAGES.LIST_SUCCESS);
      await fetchUserNFTs();
      navigate(ROUTES.MARKETPLACE);
    } catch (err: any) {
      message.error(MESSAGES.LIST_FAILED + (err.message || err));
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchUserNFTs();
    } else {
      setNfts([]);
    }
  }, [isConnected]);

  return (
    <>
      {pageLoading && <LoadingOverlay />}
      <div className="homePage">
        <h2>Tạo NFT của riêng bạn</h2>

        <div className="connectButton">
          <ConnectButton />
        </div>

        <MintForm onSuccess={fetchUserNFTs} />
      </div>
    </>
  );
};
