import React, { useState } from 'react'
import { Card, Row, Col, Button, Typography, Spin, Alert, Input, Select, Tag, Divider } from 'antd'
import { SearchOutlined, ReloadOutlined, UserOutlined, PictureOutlined } from '@ant-design/icons'
import { useAccount } from 'wagmi'
import { useUserNFTs, useContractNFTs } from '../hooks/useMoralis'
import { useMoralisContext } from './MoralisProvider'

const { Title, Text, Paragraph } = Typography
const { Meta } = Card
const { Search } = Input
const { Option } = Select

const MoralisNFTList: React.FC = () => {
  const { address, isConnected } = useAccount()
  const { isReady, error: moralisError } = useMoralisContext()
  const [selectedChain, setSelectedChain] = useState('polygon')
  const [contractSearch, setContractSearch] = useState('')
  const [showContractNFTs, setShowContractNFTs] = useState(false)

  // User NFTs hook
  const {
    nfts: userNFTs,
    loading: userLoading,
    error: userError,
    hasMore: userHasMore,
    loadMore: userLoadMore,
    refresh: userRefresh
  } = useUserNFTs({
    enabled: isConnected && isReady,
    chain: selectedChain,
    limit: 12
  })

  // Contract NFTs hook (for search)
  const {
    nfts: contractNFTs,
    loading: contractLoading,
    error: contractError,
    refresh: contractRefresh
  } = useContractNFTs(contractSearch, {
    enabled: showContractNFTs && !!contractSearch,
    chain: selectedChain,
    limit: 20
  })

  const handleContractSearch = (value: string) => {
    if (value && value.length === 42 && value.startsWith('0x')) {
      setContractSearch(value)
      setShowContractNFTs(true)
    } else {
      setShowContractNFTs(false)
    }
  }

  // Log errors to console
  if (contractError) {
    console.log('Moralis Contract Error:', contractError);
  }
  if (userError) {
    console.log('Moralis User NFTs Error:', userError);
  }

  const NFTCard: React.FC<{ nft: any; source: 'user' | 'contract' }> = ({ nft, source }) => (
    <Card
      hoverable
      cover={
        <div style={{ height: 200, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
          <img
            alt={nft.name}
            src={nft.image}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder-nft.png'
            }}
          />
        </div>
      }
      actions={[
        <Button 
          key="view" 
          type="link" 
          icon={<PictureOutlined />}
          onClick={() => window.open(nft.image, '_blank')}
        >
          View
        </Button>
      ]}
    >
      <Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{nft.name}</span>
            <Tag color={source === 'user' ? 'blue' : 'green'}>
              {source === 'user' ? 'My NFT' : 'Contract'}
            </Tag>
          </div>
        }
        description={
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Token ID: {nft.tokenId}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Contract: {nft.shortAddress}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Owner: {nft.shortOwner}
            </Text>
            {nft.attributes && nft.attributes.length > 0 && (
              <>
                <br />
                <div style={{ marginTop: '8px' }}>
                  {nft.attributes.slice(0, 2).map((attr: any, index: number) => (
                    <Tag key={index} style={{ fontSize: '10px', padding: '2px 4px' }}>
                      {attr.trait_type}: {attr.value}
                    </Tag>
                  ))}
                  {nft.attributes.length > 2 && (
                    <Tag style={{ fontSize: '10px', padding: '2px 4px' }}>
                      +{nft.attributes.length - 2} more
                    </Tag>
                  )}
                </div>
              </>
            )}
          </div>
        }
      />
    </Card>
  )

  if (!isReady) {
    // Log error to console if there's a Moralis error
    if (moralisError) {
      console.log('Moralis Error:', moralisError);
    }
    
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        {moralisError ? (
          <Alert
            message="🛠️ Chức năng Moralis đang hoàn thiện"
            description={
              <div>
                <Text>Chức năng NFT Explorer đang được phát triển và hoàn thiện.</Text>
                <br />
                <Text strong>Vui lòng chờ đợi trong thời gian tới!</Text>
              </div>
            }
            type="warning"
            showIcon
          />
        ) : (
          <div>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text>Initializing Moralis...</Text>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            🔥 Moralis NFT Explorer
          </Title>
          <Text type="secondary">
            Powered by Moralis APIs - Real-time NFT data from multiple blockchains
          </Text>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Select
            value={selectedChain}
            onChange={setSelectedChain}
            style={{ width: 120 }}
          >
            <Option value="polygon">Polygon</Option>
            <Option value="eth">Ethereum</Option>
            <Option value="bsc">BSC</Option>
            <Option value="avalanche">Avalanche</Option>
          </Select>
          
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => {
              userRefresh()
              if (showContractNFTs) contractRefresh()
            }}
            loading={userLoading || contractLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Contract Search */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={4}>🔍 Explore NFT Contract</Title>
        <Search
          placeholder="Enter NFT contract address (0x...)"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={handleContractSearch}
          prefix={<SearchOutlined />}
        />
        <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
          Try popular contracts: CryptoPunks (0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB), 
          BAYC (0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D)
        </Text>
      </Card>

      {/* Contract NFTs Results */}
      {showContractNFTs && (
        <>
          <Title level={3}>📦 Contract NFTs</Title>
          {contractLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                <Text>Loading contract NFTs...</Text>
              </div>
            </div>
          ) : contractError ? (
            <Alert
              message="🛠️ Chức năng Contract NFTs đang hoàn thiện"
              description="Chức năng tìm kiếm NFT theo contract đang được phát triển. Vui lòng chờ đợi!"
              type="warning"
              showIcon
              style={{ marginBottom: '24px' }}
            />
          ) : contractNFTs.length === 0 ? (
            <Alert
              message="No NFTs found"
              description="This contract might not have any NFTs or might not be a valid NFT contract."
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />
          ) : (
            <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
              {contractNFTs.map((nft, index) => (
                <Col key={`contract-${nft.id}-${index}`} xs={24} sm={12} md={8} lg={6}>
                  <NFTCard nft={nft} source="contract" />
                </Col>
              ))}
            </Row>
          )}
          <Divider />
        </>
      )}

      {/* User NFTs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={3} style={{ margin: 0 }}>
          <UserOutlined /> My NFTs {isConnected && `(${userNFTs.length})`}
        </Title>
        {isConnected && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
          </Text>
        )}
      </div>

      {!isConnected ? (
        <Alert
          message="Connect Wallet to View Your NFTs"
          description="Please connect your wallet to see your NFT collection across multiple blockchains."
          type="info"
          showIcon
        />
      ) : userLoading && userNFTs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Loading your NFTs from {selectedChain}...</Text>
          </div>
        </div>
      ) : userError ? (
        <Alert
          message="🛠️ Chức năng My NFTs đang hoàn thiện"
          description="Chức năng hiển thị NFT cá nhân đang được phát triển. Vui lòng chờ đợi!"
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={userRefresh}>
              Thử lại
            </Button>
          }
        />
      ) : userNFTs.length === 0 ? (
        <Alert
          message="No NFTs Found"
          description={`You don't have any NFTs on ${selectedChain} network yet. Try switching networks or mint some NFTs!`}
          type="info"
          showIcon
        />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {userNFTs.map((nft, index) => (
              <Col key={`user-${nft.id}-${index}`} xs={24} sm={12} md={8} lg={6}>
                <NFTCard nft={nft} source="user" />
              </Col>
            ))}
          </Row>

          {userHasMore && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button 
                type="primary" 
                loading={userLoading}
                onClick={userLoadMore}
                size="large"
              >
                Load More NFTs
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MoralisNFTList 