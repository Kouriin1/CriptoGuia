
export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}
