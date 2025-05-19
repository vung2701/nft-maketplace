import { Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadFileToIPFS, uploadMetadataToIPFS } from '../services/apiPinata';
import { useAccount, useChainId, usePublicClient, useWriteContract } from 'wagmi';
import NFTCollection from '../abis/NFTCollection.json';
import { NFT_CONTRACTS } from '../types/network';

interface MintFormProps {
  onSuccess?: () => void;
}

export const MintForm = ({ onSuccess }: MintFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const [form] = Form.useForm();

  const chainId = useChainId();
  const contractAddress = NFT_CONTRACTS[chainId];

  const handleFinish = async ({ name, description }: any) => {
    if (!isConnected || !address) return message.error('Vui lòng kết nối ví!');
    if (!file) return message.error('Vui lòng upload ảnh!');

    const hide = message.loading('Đang xử lý...', 0);
    setLoading(true);

    try {
      // Upload image to IPFS
      setCurrentStep('Đang upload ảnh lên IPFS...');
      const imageURL = await uploadFileToIPFS(file);
      if (!imageURL) throw new Error('Upload ảnh thất bại');

      // Upload metadata to IPFS
      setCurrentStep('Đang upload metadata lên IPFS...');
      const tokenURI = await uploadMetadataToIPFS({ name, description, image: imageURL });
      if (!tokenURI) throw new Error('Upload metadata thất bại');

      // Mint NFT
      setCurrentStep('Đang mint NFT...');
      const mintTx = await writeContractAsync({
        address: contractAddress as `0x${string}`,
        abi: NFTCollection,
        functionName: 'mintNFT',
        args: [address, tokenURI]
      });

      setCurrentStep('Đang đợi xác nhận giao dịch...');
      await publicClient?.waitForTransactionReceipt({ hash: mintTx });

      message.success('Mint NFT thành công 🎉');
      form.resetFields();
      setFile(null);
      onSuccess?.();
    } catch (err: any) {
      console.error('Mint error:', err);
      message.error(`Mint thất bại: ${err.message || 'Đã có lỗi xảy ra'}`);
    } finally {
      hide();
      setLoading(false);
      setCurrentStep('');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item label="Tên NFT" name="name" rules={[{ required: true, message: 'Nhập tên NFT' }]}>
        <Input disabled={loading} />
      </Form.Item>
      <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Nhập mô tả' }]}>
        <Input.TextArea rows={3} disabled={loading} />
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
          disabled={loading}
        >
          <Button icon={<UploadOutlined />} disabled={loading}>
            Chọn ảnh
          </Button>
        </Upload>
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading} disabled={!isConnected || loading}>
        {loading ? currentStep : 'Mint NFT'}
      </Button>
    </Form>
  );
};
