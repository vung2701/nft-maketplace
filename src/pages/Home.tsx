import { useEffect, useState } from 'react';
import { NFTItem } from '../types';
import { Row, Col, message, Divider, Spin } from 'antd';
import { useAccount, usePublicClient, useReadContract, useWriteContract } from 'wagmi';
import NFTCollection from '../abis/NFTCollection.json';
import MarketPlace from '../abis/Marketplace.json';
import axios from 'axios';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MintForm } from '../components/MintForm';
import { NFTCard } from '../components/NFTCard';
import { parseEther } from 'viem';

const convertIpfsToHttp = (ipfsUrl: string) =>
  ipfsUrl.startsWith('ipfs://') ? ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/') : ipfsUrl;

export const Home: React.FC = () => {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const { data: balance } = useReadContract({
    address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
    abi: NFTCollection,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address && isConnected }
  });

  const fetchUserNFTs = async () => {
    if (!isConnected || !address || !balance) return message.error('Vui lòng kết nối ví!');

    try {
      setLoading(true);
      const nftItems: NFTItem[] = [];
      const tokenCounter = await publicClient.readContract({
        address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFTCollection,
        functionName: 'tokenCounter'
      });

      for (let tokenId = 0; tokenId < Number(tokenCounter); tokenId++) {
        try {
          const tokenOwner = await publicClient.readContract({
            address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
            abi: NFTCollection,
            functionName: 'ownerOf',
            args: [BigInt(tokenId)]
          });

          if (tokenOwner.toLowerCase() === address.toLowerCase()) {
            const tokenURI = await publicClient.readContract({
              address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
              abi: NFTCollection,
              functionName: 'tokenURI',
              args: [BigInt(tokenId)]
            });
            const {
              data: { name, description, image }
            } = await axios.get(convertIpfsToHttp(tokenURI as string));

            const listing = await publicClient.readContract({
              address: import.meta.env.VITE_MARKETPLACE_ADDRESS as `0x${string}`,
              abi: MarketPlace,
              functionName: 'getListing',
              args: [import.meta.env.VITE_NFT_CONTRACT_ADDRESS, BigInt(tokenId)]
            });

            const isListed = (listing as any)[0] !== '0x0000000000000000000000000000000000000000';
            const price = isListed ? (Number((listing as any)[1]) / 1e18).toString() : undefined;

            nftItems.push({
              tokenId,
              name,
              description,
              image: convertIpfsToHttp(image),
              owner: address,
              isListed,
              price
            });
          }
        } catch (error) {
          console.log(`Skipping token ID ${tokenId}:`, error);
        }
      }

      setNfts(nftItems);
    } catch (err: any) {
      message.error(`Lỗi khi tải NFT: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleListNFT = async (tokenId: number, price: string) => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');
    if (!price || isNaN(Number(price)) || Number(price) <= 0) return message.error('Giá không hợp lệ!');

    try {
      setLoading(true);
      const approveTx = await writeContractAsync({
        address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFTCollection,
        functionName: 'approve',
        args: [import.meta.env.VITE_MARKETPLACE_ADDRESS, BigInt(tokenId)]
      });
      await publicClient.waitForTransactionReceipt({ hash: approveTx });

      const listTx = await writeContractAsync({
        address: import.meta.env.VITE_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: MarketPlace,
        functionName: 'listNFT',
        args: [import.meta.env.VITE_NFT_CONTRACT_ADDRESS, BigInt(tokenId), parseEther(price)]
      });
      await publicClient.waitForTransactionReceipt({ hash: listTx });

      message.success('Liệt kê NFT thành công 🎉');
      await fetchUserNFTs();
    } catch (err: any) {
      message.error(`Lỗi khi liệt kê NFT: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNFT = async (tokenId: number, price: string) => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');

    try {
      setLoading(true);
      const buyTx = await writeContractAsync({
        address: import.meta.env.VITE_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: MarketPlace,
        functionName: 'buyNFT',
        args: [import.meta.env.VITE_NFT_CONTRACT_ADDRESS, BigInt(tokenId)],
        value: parseEther(price)
      });
      await publicClient.waitForTransactionReceipt({ hash: buyTx });

      message.success('Mua NFT thành công 🎉');
      await fetchUserNFTs();
    } catch (err: any) {
      message.error(`Lỗi khi mua NFT: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && balance) fetchUserNFTs();
  }, [isConnected, balance]);

  return (
    <div className="homePage">
      <h2>Trang chủ</h2>
      <div className="connectButton">
        <ConnectButton />
      </div>
      <MintForm onSuccess={fetchUserNFTs} />
      {loading && <Spin />}
      {nfts.length > 0 && (
        <>
          <Divider style={{ borderColor: '#bbb', margin: '30px 0', fontSize: 22 }}>NFT của bạn</Divider>
          <Row gutter={[16, 16]}>
            {nfts.map((nft) => (
              <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={6}>
                <NFTCard
                  nft={nft}
                  onList={(price) => handleListNFT(nft.tokenId, price)}
                  onBuy={
                    nft.isListed && nft.owner.toLowerCase() !== address?.toLowerCase()
                      ? () => handleBuyNFT(nft.tokenId, nft.price!)
                      : undefined
                  }
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};
