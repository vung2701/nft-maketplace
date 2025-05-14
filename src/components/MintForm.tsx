import { Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadFileToIPFS, uploadMetadataToIPFS } from '../services/apiPinata';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import NFTCollection from '../abis/NFTCollection.json';
import MarketPlace from '../abis/Marketplace.json';

interface MintFormProps {
  onSuccess?: () => void;
}

export const MintForm = ({ onSuccess }: MintFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const [form] = Form.useForm();

  const handleFinish = async ({ name, description }: any) => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');
    if (!file) return message.error('Vui lòng upload ảnh!');

    try {
      setLoading(true);
      message.loading('Đang upload ảnh...');
      const imageURL = await uploadFileToIPFS(file);

      message.loading('Đang upload metadata...');
      const tokenURI = await uploadMetadataToIPFS({ name, description, image: imageURL });

      message.loading('Đang mint NFT...');
      const mintTx = await writeContractAsync({
        address: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: NFTCollection,
        functionName: 'mintNFT',
        args: [address, tokenURI]
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: mintTx });

      const tokenId = receipt.logs.find(
        (log) => log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
      )?.topics[3];
      if (!tokenId) throw new Error('Không tìm thấy tokenId');

      message.loading('Đang liệt kê NFT...');
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
        args: [import.meta.env.VITE_NFT_CONTRACT_ADDRESS, BigInt(tokenId), BigInt(0.01 * 1e18)]
      });
      await publicClient.waitForTransactionReceipt({ hash: listTx });

      message.success('Mint và liệt kê NFT thành công 🎉');
      form.resetFields();
      setFile(null);
      onSuccess?.();
    } catch (err: any) {
      message.error(`Thao tác thất bại: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item label="Tên NFT" name="name" rules={[{ required: true, message: 'Nhập tên NFT' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Nhập mô tả' }]}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item label="Upload ảnh" rules={[{ required: true, message: 'Chọn ảnh' }]}>
        <Upload
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
          maxCount={1}
          fileList={file ? [file as any] : []}
          onRemove={() => setFile(null)}
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
