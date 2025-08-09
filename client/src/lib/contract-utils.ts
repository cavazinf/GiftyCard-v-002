import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config, contracts } from '@/config/wagmi';
import { parseEther, formatEther, type Address } from 'viem';

// ABI for GiftCardNFT contract
export const giftCardABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "balance", "type": "uint256" },
      { "internalType": "uint256", "name": "expirationMonths", "type": "uint256" },
      { "internalType": "string", "name": "category", "type": "string" },
      { "internalType": "string", "name": "uri", "type": "string" }
    ],
    "name": "createGiftCard",
    "outputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "address", "name": "tbaAccount", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "address", "name": "merchant", "type": "address" }
    ],
    "name": "redeemGiftCard",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "getGiftCard",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "originalBalance", "type": "uint256" },
          { "internalType": "uint256", "name": "currentBalance", "type": "uint256" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "uint256", "name": "expiresAt", "type": "uint256" },
          { "internalType": "address", "name": "merchant", "type": "address" },
          { "internalType": "address", "name": "tbaAccount", "type": "address" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "string", "name": "category", "type": "string" }
        ],
        "internalType": "struct GiftCardNFT.GiftCard",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getUserGiftCards",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "getTBAAddress",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// ABI for ERC20 (USDC)
export const erc20ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "spender", "type": "address" },
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export interface CreateGiftCardParams {
  to: Address;
  balance: bigint; // in USDC (6 decimals)
  expirationMonths: number;
  category: string;
  uri: string;
}

export interface RedeemGiftCardParams {
  tokenId: bigint;
  amount: bigint;
  merchant: Address;
}

export interface OnChainGiftCard {
  originalBalance: bigint;
  currentBalance: bigint;
  createdAt: bigint;
  expiresAt: bigint;
  merchant: Address;
  tbaAccount: Address;
  isActive: boolean;
  category: string;
}

/**
 * Create a new gift card NFT on-chain
 */
export async function createGiftCard(
  chainId: number,
  params: CreateGiftCardParams
): Promise<{ tokenId: bigint; tbaAccount: Address; txHash: `0x${string}` }> {
  const contractAddress = contracts.giftCardNFT[chainId as keyof typeof contracts.giftCardNFT];
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error(`GiftCardNFT contract not deployed on chain ${chainId}`);
  }

  // First approve USDC spending
  const usdcAddress = contracts.usdc[chainId as keyof typeof contracts.usdc];
  const approveHash = await writeContract(config, {
    address: usdcAddress as Address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [contractAddress as Address, params.balance],
  });

  await waitForTransactionReceipt(config, { hash: approveHash });

  // Create gift card
  const hash = await writeContract(config, {
    address: contractAddress as Address,
    abi: giftCardABI,
    functionName: 'createGiftCard',
    args: [params.to, params.balance, BigInt(params.expirationMonths), params.category, params.uri],
  });

  const receipt = await waitForTransactionReceipt(config, { hash });
  
  // Parse logs to get tokenId and tbaAccount
  const createEvent = receipt.logs.find(log => 
    log.topics[0] === '0x...' // GiftCardCreated event signature
  );

  // For now, return mock values - in production, parse from logs
  return {
    tokenId: BigInt(1), // Parse from event
    tbaAccount: '0x0000000000000000000000000000000000000000' as Address, // Parse from event
    txHash: hash,
  };
}

/**
 * Redeem a gift card
 */
export async function redeemGiftCard(
  chainId: number,
  params: RedeemGiftCardParams
): Promise<`0x${string}`> {
  const contractAddress = contracts.giftCardNFT[chainId as keyof typeof contracts.giftCardNFT];
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error(`GiftCardNFT contract not deployed on chain ${chainId}`);
  }

  const hash = await writeContract(config, {
    address: contractAddress as Address,
    abi: giftCardABI,
    functionName: 'redeemGiftCard',
    args: [params.tokenId, params.amount, params.merchant],
  });

  await waitForTransactionReceipt(config, { hash });
  return hash;
}

/**
 * Get gift card details from chain
 */
export async function getGiftCard(
  chainId: number,
  tokenId: bigint
): Promise<OnChainGiftCard> {
  const contractAddress = contracts.giftCardNFT[chainId as keyof typeof contracts.giftCardNFT];
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error(`GiftCardNFT contract not deployed on chain ${chainId}`);
  }

  const result = await readContract(config, {
    address: contractAddress as Address,
    abi: giftCardABI,
    functionName: 'getGiftCard',
    args: [tokenId],
  });

  return result as OnChainGiftCard;
}

/**
 * Get user's gift cards
 */
export async function getUserGiftCards(
  chainId: number,
  userAddress: Address
): Promise<bigint[]> {
  const contractAddress = contracts.giftCardNFT[chainId as keyof typeof contracts.giftCardNFT];
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error(`GiftCardNFT contract not deployed on chain ${chainId}`);
  }

  const result = await readContract(config, {
    address: contractAddress as Address,
    abi: giftCardABI,
    functionName: 'getUserGiftCards',
    args: [userAddress],
  });

  return result as bigint[];
}

/**
 * Get USDC balance of an address
 */
export async function getUSDCBalance(
  chainId: number,
  address: Address
): Promise<bigint> {
  const usdcAddress = contracts.usdc[chainId as keyof typeof contracts.usdc];

  const result = await readContract(config, {
    address: usdcAddress as Address,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  return result as bigint;
}

/**
 * Format USDC amount (6 decimals)
 */
export function formatUSDC(amount: bigint): string {
  return (Number(amount) / 1e6).toFixed(2);
}

/**
 * Parse USDC amount to wei (6 decimals)
 */
export function parseUSDC(amount: string): bigint {
  return BigInt(Math.floor(parseFloat(amount) * 1e6));
}