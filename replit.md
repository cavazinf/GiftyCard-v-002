# Overview

GIFTY is a next-generation gift card system that leverages blockchain technology to transform traditional gift cards into NFTs using ERC-6551 Token Bound Accounts (TBAs). The platform enables ultra-low-cost issuance, zero-knowledge privacy proofs, and instant settlement while providing a seamless user experience through Account Abstraction (ERC-4337). The system integrates with point-of-sale (POS) terminals for real-world redemption and offers comprehensive merchant and analytics dashboards.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client application is built with React and TypeScript, utilizing a modern component-based architecture. The UI leverages Radix UI primitives with shadcn/ui components for consistent design patterns. The application uses Wouter for client-side routing and TanStack Query for server state management. Styling is handled through Tailwind CSS with custom design tokens configured for the GIFTY brand.

## Backend Architecture
The server runs on Express.js with TypeScript, implementing a RESTful API structure. The application follows a modular architecture with separate layers for routing, business logic, and data access. Mock blockchain interactions simulate smart contract operations during development, with planned integration for actual blockchain networks (Polygon/Base). The server includes middleware for request logging, error handling, and CORS management.

## Database Layer
The system uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes tables for users, gift cards, merchants, transactions, and ZK proofs. Database migrations are managed through Drizzle Kit, and the connection is established via Neon's serverless PostgreSQL service.

## Smart Contract Integration
The architecture is designed around ERC-6551 Token Bound Accounts, where each gift card NFT has its own account that can hold and manage USDC balances. Smart contracts include:
- ERC6551Registry for creating Token Bound Accounts
- ERC6551Account implementation for balance management
- GiftCardNFT as the main contract for gift card issuance
- Integration points for ERC-4337 Account Abstraction
- ZK proof verification system for privacy-preserving balance validation

## Security and Privacy
The system implements zero-knowledge proofs to verify gift card balances without revealing sensitive information. User authentication and authorization are handled through wallet connections, with plans for gasless transactions through Account Abstraction. All blockchain interactions are designed to be secure and auditable.

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