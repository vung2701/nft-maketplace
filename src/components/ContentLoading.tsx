import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface ContentLoadingProps {
  tip?: string;
  height?: number | string;
}

export const ContentLoading: React.FC<ContentLoadingProps> = ({ 
  tip = 'Đang tải dữ liệu...', 
  height = 400 
}) => {
  return (
    <div className="content-loading" style={{ height }}>
      <Spin 
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} 
        tip={tip}
      />
    </div>
  );
}; 