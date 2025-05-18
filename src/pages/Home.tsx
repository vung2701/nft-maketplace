import { useEffect, useState } from 'react';
import { NFTItem } from '../types';
import { Row, Col, message, Divider, Spin, Tag } from 'antd';
import { useAccount, useChainId, usePublicClient, useReadContract, useWriteContract } from 'wagmi';
import NFTCollection from '../abis/NFTCollection.json';
import MarketPlace from '../abis/Marketplace.json';
import axios from 'axios';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MintForm } from '../components/MintForm';
import { NFTCard } from '../components/NFTCard';
import { parseEther } from 'viem';
import { useNavigate } from 'react-router-dom';
import { MARKETPLACE_CONTRACTS, NFT_CONTRACTS } from '../types/network';

const convertIpfsToHttp = (ipfsUrl: string) =>
  ipfsUrl.startsWith('ipfs://') ? ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/') : ipfsUrl;

// Hàm rút gọn địa chỉ ví
const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const Home: React.FC = () => {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const navigate = useNavigate();
  const chainId = useChainId();
  const contractAddress = NFT_CONTRACTS[chainId];
  const marketplaceAddress = MARKETPLACE_CONTRACTS[chainId];

  const { data: balance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: NFTCollection,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !!address && isConnected }
  });

  const fetchUserNFTs = async () => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');

    try {
      setLoading(true);
      const nftItems: NFTItem[] = [];
      const tokenCounter = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: NFTCollection,
        functionName: 'tokenCounter'
      });

      // Fetch all listings from the marketplace
      const listings = (await publicClient.readContract({
        address: marketplaceAddress as `0x${string}`,
        abi: MarketPlace,
        functionName: 'getListings'
      })) as { seller: string; nftAddress: string; tokenId: bigint; price: bigint; isSold: boolean }[];

      for (let tokenId = 0; tokenId < Number(tokenCounter); tokenId++) {
        try {
          const tokenOwner = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: NFTCollection,
            functionName: 'ownerOf',
            args: [BigInt(tokenId)]
          });

          if (tokenOwner.toLowerCase() === address.toLowerCase()) {
            const tokenURI = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: NFTCollection,
              functionName: 'tokenURI',
              args: [BigInt(tokenId)]
            });
            const {
              data: { name, description, image }
            } = await axios.get(convertIpfsToHttp(tokenURI as string));

            // Check if the NFT is listed
            const listing = listings.find(
              (l) =>
                l.nftAddress.toLowerCase() === contractAddress.toLowerCase() &&
                l.tokenId === BigInt(tokenId) &&
                !l.isSold
            );
            const isListed = !!listing && listing.seller !== '0x0000000000000000000000000000000000000000';

            if (!isListed) {
              nftItems.push({
                tokenId,
                name,
                description,
                image: convertIpfsToHttp(image),
                owner: tokenOwner as string, // Sử dụng địa chỉ thực tế của chủ sở hữu
                isListed: false
              });
            }
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
        address: contractAddress as `0x${string}`,
        abi: NFTCollection,
        functionName: 'approve',
        args: [marketplaceAddress, BigInt(tokenId)]
      });
      await publicClient.waitForTransactionReceipt({ hash: approveTx });

      const listTx = await writeContractAsync({
        address: marketplaceAddress as `0x${string}`,
        abi: MarketPlace,
        functionName: 'listNFT',
        args: [contractAddress, BigInt(tokenId), parseEther(price)]
      });
      await publicClient.waitForTransactionReceipt({ hash: listTx });

      message.success('Liệt kê NFT thành công 🎉');
      await fetchUserNFTs();
      navigate('/marketplace');
    } catch (err: any) {
      message.error(`Lỗi khi liệt kê NFT: ${err.message || err}`);
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

      <Divider style={{ borderColor: '#bbb', margin: '30px 0', fontSize: 22 }}>NFT của bạn (Chưa được list)</Divider>

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
