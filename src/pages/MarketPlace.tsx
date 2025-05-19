import { useEffect, useState } from 'react';
import { useAccount, useChainId, usePublicClient, useWriteContract } from 'wagmi';
import { Row, Col, message, Spin, Divider } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import NFTCollection from '../abis/NFTCollection.json';
import MarketPlace from '../abis/Marketplace.json';
import { parseEther } from 'viem';
import { NFTItem } from '../types';
import { NFTCard } from '../components/NFTCard';
import { MARKETPLACE_CONTRACTS, NFT_CONTRACTS } from '../types/network';

const convertIpfsToHttp = (ipfsUrl: string) =>
  ipfsUrl.startsWith('ipfs://') ? ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/') : ipfsUrl;

const Marketplace = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [myListedNFTs, setMyListedNFTs] = useState<NFTItem[]>([]);
  const [otherListedNFTs, setOtherListedNFTs] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  const chainId = useChainId();
  const contractAddress = NFT_CONTRACTS[chainId];
  const marketplaceAddress = MARKETPLACE_CONTRACTS[chainId];

  const fetchListedNFTs = async () => {
    if (!isConnected || !address) return;

    try {
      setLoading(true);
      const myNFTs: NFTItem[] = [];
      const otherNFTs: NFTItem[] = [];

      // Lấy tất cả các listing từ marketplace
      const listings = (await publicClient.readContract({
        address: marketplaceAddress as `0x${string}`,
        abi: MarketPlace,
        functionName: 'getListings'
      })) as { seller: string; nftAddress: string; tokenId: bigint; price: bigint; isSold: boolean }[];

      // Duyệt qua từng listing để lấy thông tin chi tiết
      for (const listing of listings) {
        // Chỉ xử lý các NFT từ contractAddress và chưa được bán
        if (listing.nftAddress.toLowerCase() === contractAddress.toLowerCase() && !listing.isSold) {
          try {
            // Lấy tokenURI từ hợp đồng NFT
            const tokenURI = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: NFTCollection,
              functionName: 'tokenURI',
              args: [listing.tokenId]
            });

            // Tải metadata từ tokenURI
            const { default: axios } = await import('axios');
            const {
              data: { name, description, image }
            } = await axios.get(convertIpfsToHttp(tokenURI as string));

            // Tạo đối tượng NFTItem
            const nftItem: NFTItem = {
              tokenId: Number(listing.tokenId),
              name,
              description,
              image: convertIpfsToHttp(image),
              owner: listing.seller,
              isListed: true,
              price: (Number(listing.price) / 1e18).toString(),
              listingId: listings.indexOf(listing) // Lưu listingId để mua
            };

            // Phân loại NFT
            if (listing.seller.toLowerCase() === address.toLowerCase()) {
              myNFTs.push(nftItem);
            } else {
              otherNFTs.push(nftItem);
            }
          } catch (error) {
            console.warn(`Lỗi khi lấy dữ liệu token ${listing.tokenId}:`, error);
          }
        }
      }

      setMyListedNFTs(myNFTs);
      setOtherListedNFTs(otherNFTs);
    } catch (err) {
      message.error('Lỗi khi tải danh sách NFT');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNFT = async (nft: NFTItem) => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');

    try {
      const txHash = await writeContractAsync({
        address: marketplaceAddress as `0x${string}`,
        abi: MarketPlace,
        functionName: 'buyNFT',
        args: [BigInt(nft.listingId!)], // Sử dụng listingId
        value: parseEther(nft.price)
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      message.success('Mua NFT thành công 🎉');
      fetchListedNFTs(); // Làm mới danh sách sau khi mua
    } catch (err: any) {
      message.error(`Lỗi khi mua NFT: ${err.message || err}`);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchListedNFTs();
    } else {
      // Clear NFTs when disconnected
      setMyListedNFTs([]);
      setOtherListedNFTs([]);
    }
  }, [isConnected, address, chainId]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2>Marketplace</h2>
        <ConnectButton />
      </div>

      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      ) : (
        <>
          <Divider style={{ borderColor: '#bbb', margin: '30px 0', fontSize: 22 }}>NFT của bạn (Đang bán)</Divider>
          <Row gutter={[16, 16]}>
            {myListedNFTs.length > 0 ? (
              myListedNFTs.map((nft) => (
                <Col key={nft.tokenId} xs={24} sm={12} md={8} lg={6}>
                  <NFTCard
                    nft={nft}
                    showStatus
                    customAction={
                      <div style={{ padding: '16px 0', color: '#52c41a', fontWeight: 'bold' }}>
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

          <Divider style={{ borderColor: '#bbb', margin: '30px 0', fontSize: 22 }}>Cửa hàng NFT</Divider>
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
  );
};

export default Marketplace;
