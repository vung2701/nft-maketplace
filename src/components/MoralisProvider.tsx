import React, { createContext, useContext, ReactNode } from 'react'
import { useMoralisInit } from '../hooks/useMoralis'
import { Alert, Spin, Typography } from 'antd'
import { DatabaseOutlined, WarningOutlined } from '@ant-design/icons'

const { Text, Paragraph } = Typography

// Context type
interface MoralisContextType {
  isInitialized: boolean
  isLoading: boolean
  error: string | null
  isReady: boolean
  config: any
}

// Create context
const MoralisContext = createContext<MoralisContextType | undefined>(undefined)

// Provider props
interface MoralisProviderProps {
  children: ReactNode
  showStatus?: boolean
}

// Provider component
export const MoralisProvider: React.FC<MoralisProviderProps> = ({ 
  children, 
  showStatus = false 
}) => {
  const moralis = useMoralisInit()

  // Show status if requested
  if (showStatus) {
    // Log error to console if there's a Moralis error
    if (!moralis.isLoading && moralis.error) {
      console.log('Moralis Initialization Error:', moralis.error);
    }
    
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <DatabaseOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          <h2>Moralis Integration Status</h2>
        </div>

        {moralis.isLoading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text>Initializing Moralis...</Text>
            </div>
          </div>
        )}

        {!moralis.isLoading && moralis.error && (
          <Alert
            message="🛠️ Chức năng Moralis đang hoàn thiện"
            description={
              <div>
                <Text>Chức năng Moralis đang được phát triển và hoàn thiện.</Text>
                <br />
                <Text strong>Vui lòng chờ đợi trong thời gian tới!</Text>
              </div>
            }
            type="warning"
            showIcon
            icon={<WarningOutlined />}
          />
        )}

        {!moralis.isLoading && moralis.isInitialized && (
          <Alert
            message="Moralis Ready!"
            description={
              <div>
                <Text strong>✅ Moralis has been initialized successfully</Text>
                <br />
                <Text>Supported chains: {moralis.config.supportedChains?.join(', ')}</Text>
                <br />
                <Text>Default chain: {moralis.config.defaultChain}</Text>
              </div>
            }
            type="success"
            showIcon
          />
        )}

        {!moralis.isLoading && !moralis.isInitialized && !moralis.error && (
          <Alert
            message="Moralis Not Configured"
            description={
              <div>
                <Paragraph>
                  Moralis is not configured yet. This is optional - you can still use The Graph for data queries.
                </Paragraph>
                <Text strong>To enable Moralis features:</Text>
                <ol>
                  <li>Sign up at <a href="https://admin.moralis.io/" target="_blank" rel="noopener noreferrer">Moralis Dashboard</a></li>
                  <li>Create a new project</li>
                  <li>Copy your API key</li>
                  <li>Update the API key in the client configuration</li>
                </ol>
              </div>
            }
            type="warning"
            showIcon
          />
        )}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <MoralisContext.Provider value={moralis}>
            {children}
          </MoralisContext.Provider>
        </div>
      </div>
    )
  }

  // Normal provider without status display
  return (
    <MoralisContext.Provider value={moralis}>
      {children}
    </MoralisContext.Provider>
  )
}

// Custom hook to use Moralis context
export const useMoralisContext = (): MoralisContextType => {
  const context = useContext(MoralisContext)
  if (context === undefined) {
    throw new Error('useMoralisContext must be used within a MoralisProvider')
  }
  return context
}

// Quick status component
export const MoralisStatus: React.FC = () => {
  const { isInitialized, isLoading, error, isReady } = useMoralisContext()

  // Log error to console
  if (error) {
    console.log('Moralis Status Error:', error);
  }

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Spin size="small" />
      <Text type="secondary">Initializing Moralis...</Text>
    </div>
  )

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Text type="warning">🛠️ Chức năng đang hoàn thiện</Text>
    </div>
  )

  if (isReady) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Text type="success">Moralis Ready</Text>
    </div>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Text type="warning">Moralis Not Configured</Text>
    </div>
  )
} 