import React from 'react';
import { Card, Tag, Button } from 'antd';
import { useMoralisContext } from '../../providers/MoralisProvider';
import { isMoralisInitialized } from '../../config/moralis';

export const MoralisStatus: React.FC = () => {
  const { isInitialized, isLoading, error, retry } = useMoralisContext();
  const configInitialized = isMoralisInitialized();

  return (
    <Card title="🔍 Moralis Debug Status" size="small" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Tag color={isInitialized ? 'green' : 'red'}>Provider: {isInitialized ? 'Initialized' : 'Not Initialized'}</Tag>

        <Tag color={configInitialized ? 'green' : 'red'}>Config: {configInitialized ? 'Ready' : 'Not Ready'}</Tag>

        <Tag color={isLoading ? 'orange' : 'blue'}>Loading: {isLoading ? 'Yes' : 'No'}</Tag>

        {error && <Tag color="red">Error: {error}</Tag>}

        <Button size="small" onClick={retry}>
          Retry Init
        </Button>

        <div style={{ fontSize: '12px', color: '#666' }}>
          API Key:{' '}
          {import.meta.env.VITE_MORALIS_API_KEY
            ? `✅ Present (${import.meta.env.VITE_MORALIS_API_KEY.substring(0, 8)}...)`
            : '❌ Missing'}
        </div>
      </div>
    </Card>
  );
};
