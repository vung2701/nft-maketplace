import { Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadFileToIPFS, uploadMetadataToIPFS } from '../services/apiPinata';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import NFTCollection from '../abis/NFTCollection.json';
import MarketPlace from '../abis/Marketplace.json';

export const MintForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const handleFinish = async (values: any) => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');
    if (!file) return message.error('Vui lòng upload ảnh!');

    try {
      setLoading(true);
      message.loading('Đang upload ảnh lên IPFS...');

      // 1. Upload ảnh
      const imageURL = await uploadFileToIPFS(file);

      // 2. Tạo metadata
      const metadata = {
        name: values.name,
        description: values.description,
        image: imageURL
      };

      // 3. Upload metadata
      message.loading('Đang upload metadata lên IPFS...');
      const tokenURI = await uploadMetadataToIPFS(metadata);

      // 4. Gọi mintNFT trên smart contract
      message.loading('Đang gọi mintNFT trên smart contract...');
      const mintTxHash = await writeContractAsync({
        address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFTCollection,
        functionName: 'mintNFT',
        args: [address, tokenURI]
      });

      // Chờ giao dịch hoàn tất và lấy tokenId
      message.loading('Đang chờ xác nhận giao dịch...');
      const receipt = await publicClient.waitForTransactionReceipt({ hash: mintTxHash });

      // Kiểm tra trạng thái giao dịch
      if (receipt.status !== 'success') {
        console.error('Transaction receipt:', receipt);
        throw new Error(`Giao dịch mintNFT thất bại: ${receipt.status}`);
      }

      // Debug: Ghi log giao dịch
      console.log('Transaction receipt:', receipt);
      console.log('Transaction logs:', receipt.logs);

      // Lấy tokenId từ giá trị trả về của mintNFT
      const mintFunctionAbi = NFTCollection.find((item: any) => item.name === 'mintNFT' && item.type === 'function');
      const log = receipt.logs.find((log) =>
        log.topics.includes('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef')
      );
      let tokenId;
      if (log) {
        tokenId = BigInt(log.topics[3]).toString();
      } else {
        // Fallback: Giả sử mintNFT trả về tokenId trực tiếp
        const decodedResult = await publicClient.readContract({
          address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
          abi: NFTCollection,
          functionName: 'tokenCounter'
        });
        tokenId = (Number(decodedResult) - 1).toString();
        if (!tokenId || tokenId < 0) {
          throw new Error('Không thể xác định tokenId từ giao dịch');
        }
      }

      message.success('Mint NFT thành công 🎉');

      // 5. Liệt kê NFT trên Marketplace
      message.loading('Đang liệt kê NFT trên marketplace...');
      // Approve Marketplace
      await writeContractAsync({
        address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFTCollection,
        functionName: 'approve',
        args: [import.meta.env.VITE_MARKETPLACE_ADDRESS, tokenId]
      });

      // Liệt kê NFT với giá 0.01 ETH
      const price = BigInt(0.01 * 10 ** 18);
      await writeContractAsync({
        address: import.meta.env.VITE_MARKETPLACE_ADDRESS as `0x${string}`,
        abi: MarketPlace,
        functionName: 'listNFT',
        args: [import.meta.env.VITE_NFT_CONTRACT_ADDRESS, tokenId, price]
      });

      message.success('NFT đã được liệt kê trên marketplace 🎉');
    } catch (err: any) {
      console.error('Lỗi:', err);
      message.error(`Thao tác thất bại: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleFinish}>
      <Form.Item label="Tên NFT" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên NFT' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item label="Upload ảnh" rules={[{ required: true, message: 'Vui lòng upload ảnh' }]}>
        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} disabled={!isConnected}>
        Mint và List NFT
      </Button>
    </Form>
  );
};
