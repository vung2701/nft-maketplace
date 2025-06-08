import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingOverlayProps {
  tip?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ tip = 'Đang xử lý...' }) => {
  return (
    <div className="loading-overlay">
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} 
        tip={tip}
      />
    </div>
  );
}; 