import { gql } from '@apollo/client'

// Lấy tất cả NFT
export const GET_ALL_NFTS = gql`
  query GetAllNFTs($first: Int!, $skip: Int!) {
    nfts(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
      id
      tokenId
      creator
      owner
      tokenURI
      price
      isListed
      createdAt
      updatedAt
    }
  }
`

// Lấy NFT đang được bán
export const GET_LISTED_NFTS = gql`
  query GetListedNFTs($first: Int!, $skip: Int) {
    nfts(first: $first, skip: $skip, where: { isListed: true }, orderBy: createdAt, orderDirection: desc) {
      id
      tokenId
      creator
      owner
      tokenURI
      price
      createdAt
    }
  }
`

// Lấy NFT của một user
export const GET_USER_NFTS = gql`
  query GetUserNFTs($owner: String!) {
    nfts(where: { owner: $owner }) {
      id
      tokenId
      tokenURI
      price
      isListed
      createdAt
      sales {
        seller
        buyer
        price
        timestamp
      }
    }
  }
`

// Lấy thông tin chi tiết một NFT
export const GET_NFT_DETAIL = gql`
  query GetNFTDetail($tokenId: String!) {
    nft(id: $tokenId) {
      id
      tokenId
      creator
      owner
      tokenURI
      price
      isListed
      createdAt
      updatedAt
      sales {
        id
        seller
        buyer
        price
        timestamp
      }
      transfers {
        id
        from
        to
        timestamp
      }
    }
  }
`

// Lấy lịch sử giao dịch
export const GET_SALES_HISTORY = gql`
  query GetSalesHistory($first: Int!) {
    sales(first: $first, orderBy: timestamp, orderDirection: desc) {
      id
      nft {
        tokenId
        tokenURI
      }
      seller
      buyer
      price
      timestamp
    }
  }
`

// Thống kê tổng quan
export const GET_MARKETPLACE_STATS = gql`
  query GetMarketplaceStats {
    nfts(first: 1000) {
      id
      price
      isListed
    }
    sales(first: 1000) {
      id
      price
    }
  }
` 