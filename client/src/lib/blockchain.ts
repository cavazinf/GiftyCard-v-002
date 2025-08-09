// Mock blockchain utilities for GIFTY Card prototype
export interface BlockchainTransaction {
  tokenId: string;
  balance?: string;
  amount?: string;
  recipient?: string;
  merchant?: string;
}

export function generateTokenId(): string {
  return `GFC-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

export function generateTBAAddress(tokenId: string): string {
  // Mock ERC-6551 Token Bound Account address generation
  const hash = tokenId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `0x${hash.toString(16).padStart(40, '0')}`;
}

export function generateQRCode(tokenId: string): string {
  // In production, this would generate an actual QR code
  // For now, return a data URL that represents the QR code
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <rect x="10" y="10" width="180" height="180" fill="black"/>
      <rect x="20" y="20" width="160" height="160" fill="white"/>
      <text x="100" y="105" text-anchor="middle" font-family="monospace" font-size="8">${tokenId}</text>
    </svg>
  `)}`;
}

export async function mockBlockchainInteraction(
  operation: string, 
  data: BlockchainTransaction
): Promise<any> {
  // Simulate blockchain interaction delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log(`[Blockchain] ${operation}:`, data);
  
  switch (operation) {
    case 'createGiftCard':
      return {
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        tokenId: data.tokenId,
        tbaAddress: generateTBAAddress(data.tokenId),
        gasUsed: Math.floor(Math.random() * 100000) + 50000,
        status: 'confirmed'
      };
      
    case 'redeemGiftCard':
      return {
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        amount: data.amount,
        merchant: data.merchant,
        gasUsed: Math.floor(Math.random() * 80000) + 40000,
        status: 'confirmed'
      };
      
    case 'reloadGiftCard':
      return {
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        amount: data.amount,
        gasUsed: Math.floor(Math.random() * 60000) + 30000,
        status: 'confirmed'
      };
      
    default:
      return { status: 'unknown_operation' };
  }
}

export function validateTBAAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function formatBalance(balance: string | number): string {
  return `$${parseFloat(balance.toString()).toFixed(2)} USDC`;
}

export function getBlockchainExplorerUrl(txHash: string): string {
  // Mock Polygon explorer URL
  return `https://polygonscan.com/tx/${txHash}`;
}
