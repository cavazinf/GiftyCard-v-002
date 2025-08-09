import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Project ID for WalletConnect (you'll need to get this from WalletConnect dashboard)
const projectId = 'YOUR_PROJECT_ID'

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonMumbai],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
  },
})

export const supportedChains = [
  {
    id: sepolia.id,
    name: 'Sepolia Testnet',
    symbol: 'ETH',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  {
    id: polygon.id,
    name: 'Polygon Mainnet',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
  },
  {
    id: polygonMumbai.id,
    name: 'Polygon Mumbai',
    symbol: 'MATIC',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com',
  },
]

// Contract addresses (to be deployed)
export const contracts = {
  giftCardNFT: {
    [sepolia.id]: '0x0000000000000000000000000000000000000000', // Deploy address
    [polygon.id]: '0x0000000000000000000000000000000000000000', // Deploy address
    [polygonMumbai.id]: '0x0000000000000000000000000000000000000000', // Deploy address
  },
  registry: {
    [sepolia.id]: '0x0000000000000000000000000000000000000000', // Deploy address
    [polygon.id]: '0x0000000000000000000000000000000000000000', // Deploy address
    [polygonMumbai.id]: '0x0000000000000000000000000000000000000000', // Deploy address
  },
  usdc: {
    [sepolia.id]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDC Sepolia
    [polygon.id]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC Polygon
    [polygonMumbai.id]: '0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747', // USDC Mumbai
  },
} as const

export type SupportedChainId = keyof typeof contracts.giftCardNFT