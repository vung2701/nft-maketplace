export interface NFTItem {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  owner: string;
  isListed: boolean;
  price?: string;
}