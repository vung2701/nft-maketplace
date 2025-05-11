export interface NFTItem {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  owner: string;
  price?: string;
  isListed?: boolean;
}
