# Overview

GIFTY is a next-generation gift card system that leverages blockchain technology to transform traditional gift cards into NFTs using ERC-6551 Token Bound Accounts (TBAs). The platform enables ultra-low-cost issuance, zero-knowledge privacy proofs, and instant settlement while providing a seamless user experience through Account Abstraction (ERC-4337). The system integrates with point-of-sale (POS) terminals for real-world redemption and offers comprehensive merchant and analytics dashboards.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client application is built with React and TypeScript, utilizing a modern component-based architecture. The UI leverages Radix UI primitives with shadcn/ui components for consistent design patterns. The application uses Wouter for client-side routing and TanStack Query for server state management. Styling is handled through Tailwind CSS with custom design tokens configured for the GIFTY brand.

**Web3 Integration**: Full Wagmi v2 integration provides wallet connectivity (MetaMask), transaction handling, and smart contract interactions. The app supports multiple chains (Polygon, Sepolia, Mumbai) with automatic network switching and balance management.

## Backend Architecture
The server runs on Express.js with TypeScript, implementing a RESTful API structure. The application follows a modular architecture with separate layers for routing, business logic, and data access. The backend handles traditional database operations while blockchain interactions are managed client-side through Wagmi for better decentralization and security.

## Database Layer
The system uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes tables for users, gift cards, merchants, transactions, and ZK proofs. Database migrations are managed through Drizzle Kit, and the connection is established via Neon's serverless PostgreSQL service.

## Smart Contract Integration
**FULLY IMPLEMENTED**: Complete ERC-6551 Token Bound Account system with deployed smart contracts:
- `GiftCardNFT.sol`: Main contract for NFT gift card issuance with USDC balance management
- `ERC6551Registry.sol`: Registry for creating deterministic Token Bound Accounts
- `ERC6551Account.sol`: Implementation allowing NFTs to own and manage USDC funds
- Full Hardhat development environment with deployment scripts
- Multi-network support (Polygon, Sepolia, Mumbai) with environment-based configuration

**Blockchain Features**:
- Each gift card NFT has its own Token Bound Account that holds USDC
- Users can create, redeem, and reload gift cards directly on-chain
- ZK proof system for privacy-preserving balance verification
- Account Abstraction integration points for gasless transactions

## Security and Privacy
Wallet-based authentication through MetaMask/Web3 providers ensures secure access. All smart contracts follow OpenZeppelin standards with comprehensive access controls. Zero-knowledge proof integration allows balance verification without revealing sensitive data. Token Bound Accounts provide secure, auditable fund management.

# External Dependencies

## Blockchain Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Polygon/Base Networks**: Layer 2 blockchain networks for smart contract deployment
- **USDC**: Primary stablecoin for gift card value storage and transfers
- **MetaMask**: Primary wallet provider for user authentication and transaction signing

## Development Tools
- **Drizzle ORM**: Type-safe database operations and migrations
- **TanStack Query**: Server state management and API caching
- **Radix UI**: Accessible component primitives for UI development
- **Vite**: Build tool and development server with hot module replacement

## Payment Processing
- **Cielo POS Integration**: Point-of-sale terminal integration for physical gift card redemption
- **Webhook System**: Real-time transaction notifications and status updates

## UI/UX Libraries
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for form inputs and API responses

## Monitoring and Analytics
- **Custom Analytics System**: Built-in analytics for tracking gift card usage, merchant performance, and system metrics
- **QR Code Generation**: Custom QR code utilities for gift card redemption