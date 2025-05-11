import { Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface Props {
  onMint: (data: { name: string; description: string; image: File }) => void;
}

export const MintForm = ({ onMint }: Props) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFinish = (values: any) => {
    if (!file) return message.error('Vui lòng upload ảnh!');
    onMint({ ...values, image: file });
  };

  return (
    <Form layout="vertical" onFinish={handleFinish}>
      <Form.Item label="Tên NFT" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item label="Upload ảnh">
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
      <Button type="primary" htmlType="submit">
        Mint NFT
      </Button>
    </Form>
  );
};
