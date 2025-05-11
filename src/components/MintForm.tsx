import { Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import NFTCollection from '../abis/NFTCollection.json';
import MarketPlace from '../abis/Marketplace.json';
import { uploadFileToIPFS, uploadMetadataToIPFS } from '../services/apiPinata';

export const MintForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const handleFinish = async (values: any) => {
    if (!isConnected) return message.error('Vui lòng kết nối ví!');
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
      const mintTx = await writeContractAsync({
        address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFTCollection,
        functionName: 'mintNFT',
        args: [address, tokenURI]
      });
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Chờ giao dịch được xử lý

      message.success('Mint NFT thành công 🎉');

      // 5. Liệt kê NFT trên Marketplace
      message.loading('Đang liệt kê NFT trên marketplace...');
      // Lấy tokenId từ sự kiện (giả định tokenCounter tăng dần)
      const tokenId = await fetchLatestTokenId();

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
      console.error(err);
      message.error(`Thao tác thất bại: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Hàm phụ để lấy tokenId mới nhất (giả định tokenCounter là public)
  const fetchLatestTokenId = async (): Promise<bigint> => {
    const { data } = await writeContractAsync({
      address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
      abi: NFTCollection,
      functionName: 'tokenCounter'
    });
    return BigInt(data) - BigInt(1); // tokenCounter tăng sau khi mint
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
