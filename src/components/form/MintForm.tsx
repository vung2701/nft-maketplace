import React, { useState } from 'react';
import { Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadFileToIPFS, uploadMetadataToIPFS } from '../../services/apiPinata';
import { useNFTContract } from '../../hooks/useNFTContract';
import { MESSAGES, MINT_STEPS } from '../../constants';
import { LoadingOverlay } from '../loading/LoadingOverlay';
import { useNavigate } from 'react-router-dom';

interface MintFormProps {
  onSuccess?: () => void;
}

export const MintForm: React.FC<MintFormProps> = ({ onSuccess }) => {
  // State
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [form] = Form.useForm();

  // Custom hook cho tương tác với smart contract
  const { mintNFT, isConnected } = useNFTContract();
  const navigate = useNavigate();

  // Xử lý mint NFT
  const handleFinish = async ({ name, description }: { name: string; description: string }) => {
    if (!isConnected) {
      return message.error(MESSAGES.CONNECT_WALLET);
    }
    if (!file) {
      return message.error(MESSAGES.UPLOAD_IMAGE);
    }

    const hide = message.loading('Đang xử lý...', 0);
    setLoading(true);

    try {
      // Upload ảnh lên IPFS
      setCurrentStep(MINT_STEPS.UPLOAD_IMAGE);
      const imageURL = await uploadFileToIPFS(file);
      if (!imageURL) throw new Error('Upload ảnh thất bại');

      // Upload metadata lên IPFS
      setCurrentStep(MINT_STEPS.UPLOAD_METADATA);
      const tokenURI = await uploadMetadataToIPFS({ name, description, image: imageURL });
      if (!tokenURI) throw new Error('Upload metadata thất bại');

      // Mint NFT
      setCurrentStep(MINT_STEPS.MINTING);
      const mintTx = await mintNFT(tokenURI);
      if (!mintTx) throw new Error('Mint NFT thất bại');

      // Đợi xác nhận giao dịch
      setCurrentStep(MINT_STEPS.CONFIRMING);

      message.success(MESSAGES.MINT_SUCCESS);
      form.resetFields();
      setFile(null);
      onSuccess?.();
      navigate('/');
    } catch (err: any) {
      message.error(MESSAGES.MINT_FAILED + (err.message || err));
    } finally {
      hide();
      setLoading(false);
      setCurrentStep('');
    }
  };

  return (
    <>
      {loading && <LoadingOverlay tip={currentStep} />}
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
          Mint NFT
        </Button>
      </Form>
    </>
  );
};
