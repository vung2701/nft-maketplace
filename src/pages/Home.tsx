import React, { useEffect, useState } from 'react';
import { Row, Col, message, Divider, Tag } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useNavigate } from 'react-router-dom';
import { NFTCard } from '../components/NFTCard';
import { NFTItem } from '../types';
import { useNFTContract } from '../hooks/useNFTContract';
import { ROUTES, MESSAGES, COLORS } from '../constants';
import { shortenAddress, parseWei } from '../utils/web3';
import { LoadingOverlay } from '../components/loading/LoadingOverlay';
import { MintForm } from '../components/form/MintForm';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/marketplace');
  }, []);

  return <></>;
};
