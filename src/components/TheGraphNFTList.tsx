import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Spin, Alert, Pagination } from 'antd';
import { useActiveListings, formatPrice, formatAddress, formatDate } from '../hooks/useGraphQL';

const { Title, Text } = Typography;
const { Meta } = Card;

interface Listing {
  id: string;
  seller: string;
  nftAddress: string;
  tokenId: string;
  price: string;
  listedAt: string;
  transactionHash: string;
}

const TheGraphNFTList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const skip = (currentPage - 1) * pageSize;

  const { data, isLoading, isError, error, refetch } = useActiveListings(pageSize, skip);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size="large" />
      <div style={{ marginTop: 16 }}>
        <Text>Đang tải dữ liệu từ The Graph...</Text>
      </div>
    </div>
  );

  if (isError) {
    console.log('The Graph Error:', error?.message);
    
    return (
      <Alert
        message="🛠️ Chức năng đang hoàn thiện"
        description="Chức năng đang được phát triển và hoàn thiện. Vui lòng chờ đợi!"
        type="warning"
        showIcon
        action={
          <Button onClick={() => refetch()}>
            Thử lại
          </Button>
        }
      />
    );
  }

  const listings: Listing[] = (data as { listings: Listing[] })?.listings || [];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>
        🔄 NFT Marketplace - Powered by The Graph
      </Title>
      
      <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
        Dữ liệu được truy vấn real-time từ The Graph. Tổng cộng {listings.length} NFT đang được bán.
      </Text>

      {listings.length === 0 ? (
        <Alert
          message="Chưa có NFT nào"
          description="Chưa có NFT nào được list để bán hoặc subgraph chưa được deploy."
          type="info"
          showIcon
        />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {listings.map((listing) => (
              <Col key={listing.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <div style={{ height: 200, overflow: 'hidden', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Text type="secondary">NFT #{listing.tokenId}</Text>
                    </div>
                  }
                  actions={[
                    <Button type="primary" key="buy">
                      Mua ngay
                    </Button>
                  ]}
                >
                  <Meta
                    title={`NFT #${listing.tokenId}`}
                    description={
                      <div>
                        <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                          {formatPrice(listing.price).toFixed(4)} ETH
                        </Text>
                        <br />
                        <Text type="secondary">
                          Seller: {formatAddress(listing.seller)}
                        </Text>
                        <br />
                        <Text type="secondary">
                          Listed: {formatDate(listing.listedAt)}
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
              total={listings.length + (listings.length === pageSize ? pageSize : 0)}
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