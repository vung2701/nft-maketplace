import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Spin, Alert, Pagination } from 'antd';
import { useListedNFTs, formatPrice, formatAddress, formatDate } from '../hooks/useGraphQL';

const { Title, Text } = Typography;
const { Meta } = Card;

interface NFT {
  id: string;
  tokenId: string;
  creator: string;
  owner: string;
  tokenURI: string;
  price: string;
  createdAt: string;
}

const TheGraphNFTList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const skip = (currentPage - 1) * pageSize;

  const { loading, error, data, fetchMore } = useListedNFTs(pageSize, skip);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMore({
      variables: {
        first: pageSize,
        skip: (page - 1) * pageSize
      }
    });
  };

  if (loading && !data) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" />
      <div style={{ marginTop: 16 }}>
        <Text>Đang tải dữ liệu từ The Graph...</Text>
      </div>
    </div>
  );

  if (error) {
    const isServiceUnavailable = error.message.includes('502') || 
                                error.message.includes('Bad gateway') || 
                                error.message.includes('Server response was missing');
    
    return (
      <Alert
        message={isServiceUnavailable ? "🔧 The Graph Service Temporarily Unavailable" : "Lỗi kết nối The Graph"}
        description={
          <div>
            {isServiceUnavailable ? (
              <>
                <Text>The Graph API is temporarily experiencing issues (502 Bad Gateway).</Text>
                <br />
                <Text strong>✅ Good news: Your subgraph builds successfully!</Text>
                <br />
                <Text>Please try again in a few minutes. The Graph team is working to resolve this.</Text>
                <br />
                <br />
                <Text type="secondary">
                  💡 This is a temporary infrastructure issue, not a problem with your configuration.
                </Text>
              </>
            ) : (
              <>
                <Text>Không thể tải dữ liệu: {error.message}</Text>
                <br />
                <Text>Hãy đảm bảo subgraph đã được deploy và đang hoạt động.</Text>
              </>
            )}
          </div>
        }
        type={isServiceUnavailable ? "warning" : "error"}
        showIcon
        action={
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        }
      />
    );
  }

  const nfts: NFT[] = data?.nfts || [];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>
        🔄 NFT Marketplace - Powered by The Graph
      </Title>
      
      <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
        Dữ liệu được truy vấn real-time từ The Graph. Tổng cộng {nfts.length} NFT đang được bán.
      </Text>

      {nfts.length === 0 ? (
        <Alert
          message="Chưa có NFT nào"
          description="Chưa có NFT nào được list để bán hoặc subgraph chưa được deploy."
          type="info"
          showIcon
        />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {nfts.map((nft) => (
              <Col key={nft.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <div style={{ height: 200, overflow: 'hidden' }}>
                      <img
                        alt={`NFT ${nft.tokenId}`}
                        src={nft.tokenURI}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-nft.png';
                        }}
                      />
                    </div>
                  }
                  actions={[
                    <Button type="primary" key="buy">
                      Mua ngay
                    </Button>
                  ]}
                >
                  <Meta
                    title={`NFT #${nft.tokenId}`}
                    description={
                      <div>
                        <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                          {formatPrice(nft.price).toFixed(4)} ETH
                        </Text>
                        <br />
                        <Text type="secondary">
                          Owner: {formatAddress(nft.owner)}
                        </Text>
                        <br />
                        <Text type="secondary">
                          Created: {formatDate(nft.createdAt)}
                        </Text>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={nfts.length + (nfts.length === pageSize ? pageSize : 0)}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TheGraphNFTList; 