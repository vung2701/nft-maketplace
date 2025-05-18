import { useEffect, useState } from 'react';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import { Row, Col, message, Spin, Divider } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import NFTCollection from '../abis/NFTCollection.json';
import MarketPlace from '../abis/Marketplace.json';
import { parseEther } from 'viem';
import { NFTItem } from '../types';
import { NFTCard } from '../components/NFTCard';

const convertIpfsToHttp = (ipfsUrl: string) =>
  ipfsUrl.startsWith('ipfs://') ? ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/') : ipfsUrl;

const Marketplace = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [myListedNFTs, setMyListedNFTs] = useState<NFTItem[]>([]);
  const [otherListedNFTs, setOtherListedNFTs] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyListedNFTs = async () => {
    if (!isConnected || !address) return;

    try {
      setLoading(true);
      const nftItems: NFTItem[] = [];

      const tokenCounter = await publicClient.readContract({
        address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFTCollection,
        functionName: 'tokenCounter'
      });

      // Fetch all listings from the marketplace
      const listings = (await publicClient.readContract({
        address: import.meta.env.VITE_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: MarketPlace,
        functionName: 'getListings'
      })) as { seller: string; nftAddress: string; tokenId: bigint; price: bigint; isSold: boolean }[];

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

            const { default: axios } = await import('axios');
            const {
              data: { name, description, image }
            } = await axios.get(convertIpfsToHttp(tokenURI as string));

            // Check if the NFT is listed
            const listing = listings.find(
              (l) =>
                l.nftAddress.toLowerCase() === import.meta.env.VITE_NFT_CONTRACT_ADDRESS.toLowerCase() &&
                l.tokenId === BigInt(tokenId) &&
                !l.isSold
            );

            if (listing && listing.seller.toLowerCase() === address.toLowerCase()) {
              nftItems.push({
                tokenId,
                name,
                description,
                image: convertIpfsToHttp(image),
                owner: address,
                isListed: true,
                price: (Number(listing.price) / 1e18).toString(),
                listingId: listings.indexOf(listing) // Store listingId for buying
              });
            }
          }
        } catch (error) {
          console.warn(`Lỗi với token ${tokenId}:`, error);
        }
      }

      setMyListedNFTs(nftItems);

      // Filter other listed NFTs (not owned by the user)
      const otherNFTs = listings
        .filter(
          (l) =>
            l.nftAddress.toLowerCase() === import.meta.env.VITE_NFT_CONTRACT_ADDRESS.toLowerCase() &&
            l.seller.toLowerCase() !== address.toLowerCase() &&
            !l.isSold
        )
        .map((l, index) => ({
          tokenId: Number(l.tokenId),
          name: `NFT ${l.tokenId}`, // Placeholder; ideally fetch metadata
          description: 'NFT từ người dùng khác',
          image: 'https://via.placeholder.com/300', // Placeholder
          owner: l.seller,
          isListed: true,
          price: (Number(l.price) / 1e18).toString(),
          listingId: index // Store listingId for buying
        }));

      setOtherListedNFTs(otherNFTs);
    } catch (err) {
      message.error('Lỗi khi tải NFT của bạn');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNFT = async (nft: NFTItem) => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');

    try {
      const txHash = await writeContractAsync({
        address: import.meta.env.VITE_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: MarketPlace,
        functionName: 'buyNFT',
        args: [BigInt(nft.listingId!)], // Use listingId
        value: parseEther(nft.price)
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      message.success('Mua NFT thành công 🎉');
      fetchMyListedNFTs(); // Refresh lists
    } catch (err: any) {
      message.error(`Lỗi khi mua NFT: ${err.message || err}`);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchMyListedNFTs();
    }
  }, [isConnected]);

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
