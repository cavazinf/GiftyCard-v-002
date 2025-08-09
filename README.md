# GIFTY Card - Blockchain Gift Card Platform

Sistema revolucionário de gift cards baseado em blockchain usando NFTs com Token Bound Accounts (ERC-6551) e Account Abstraction (ERC-4337).

## 🚀 Funcionalidades

### Core Features
- **NFT Gift Cards**: Cada gift card é um NFT único com saldo em USDC
- **Token Bound Accounts (ERC-6551)**: Cada NFT possui sua própria conta que pode guardar fundos
- **Account Abstraction (ERC-4337)**: Experiência sem gas para usuários finais
- **Zero Knowledge Proofs**: Verificação de saldos sem revelar informações sensíveis
- **QR Code Redemption**: Resgate fácil via QR codes
- **Multi-chain Support**: Polygon, Sepolia, Mumbai testnet

### Interface Features
- **Dashboard Moderno**: Interface React/TypeScript responsiva
- **Conexão de Carteira**: Integração com MetaMask via Wagmi
- **Criação de Gift Cards**: Interface para criar NFTs na blockchain
- **Painel de Comerciantes**: Sistema POS para aceitação
- **Analytics**: Métricas de uso e performance

## 🏗️ Arquitetura Técnica

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Wagmi v2** para integração Web3
- **TanStack Query** para gerenciamento de estado
- **Tailwind CSS** + **shadcn/ui** para UI
- **Wouter** para roteamento

### Backend
- **Express.js** + **TypeScript**
- **PostgreSQL** + **Drizzle ORM**
- **Neon Database** (serverless)

### Blockchain
- **Hardhat** para desenvolvimento
- **Foundry** para testes avançados
- **OpenZeppelin** contratos base
- **Polygon/Base** para deploy

### Smart Contracts
- `GiftCardNFT.sol` - Contrato principal dos gift cards
- `ERC6551Registry.sol` - Registry para Token Bound Accounts
- `ERC6551Account.sol` - Implementação das contas

## 🛠️ Setup e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- MetaMask ou carteira compatível

### Instalação
```bash
# Clone o repositório
git clone <repo-url>
cd gifty-card

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas configurações

# Setup do banco de dados
npm run db:push

# Inicie o desenvolvimento
npm run dev
```

### Deploy dos Smart Contracts

#### Local (Hardhat Network)
```bash
# Inicie node local
npm run node

# Deploy em outra terminal
npm run deploy:local
```

#### Testnet (Sepolia)
```bash
# Configure PRIVATE_KEY e SEPOLIA_URL no .env
npm run deploy:sepolia
```

#### Mainnet (Polygon)
```bash
# Configure PRIVATE_KEY e POLYGON_URL no .env
npm run deploy:polygon
```

### Compilação
```bash
# Compile contratos
npm run compile
```

## 📁 Estrutura do Projeto

```
gifty-card/
├── client/src/           # Frontend React
│   ├── components/       # Componentes UI
│   ├── pages/           # Páginas da aplicação
│   ├── lib/             # Utilitários e configurações
│   └── config/          # Configurações Wagmi
├── server/              # Backend Express
├── contracts/           # Smart contracts Solidity
├── scripts/             # Scripts de deploy
├── shared/              # Schemas compartilhados
└── deployments/         # Endereços dos contratos
```

## 🔐 Segurança

### Smart Contracts
- Auditados com base nos padrões OpenZeppelin
- Implementação padrão ERC-6551 e ERC-4337
- Verificação de propriedade em todas as operações
- Timeouts automáticos para gift cards expirados

### Zero Knowledge Proofs
- Verificação de saldos sem revelar montantes
- Provas de validade sem exposer dados sensíveis
- Integração com sistemas de privacidade

## 🌐 Integrações

### POS Cielo
- API para integração com terminais físicos
- Webhook para notificações em tempo real
- Suporte a pagamentos híbridos

### Blockchain Networks
- **Polygon Mainnet**: Produção com baixas taxas
- **Sepolia**: Testnet Ethereum
- **Mumbai**: Testnet Polygon
- **Base**: L2 otimizada para pagamentos

## 📊 Monitoramento

### Analytics
- Métricas de uso dos gift cards
- Performance dos comerciantes
- Volume de transações
- Taxas de conversão

### Logs
- Transações blockchain
- Operações do backend
- Erros e performance

## 🚀 Roadmap

### V1.0 (Atual)
- ✅ NFT Gift Cards básicos
- ✅ Interface de usuário
- ✅ Conexão carteira
- ✅ Smart contracts ERC-6551

### V1.1 (Próximo)
- [ ] Deploy em mainnet
- [ ] Integração POS real
- [ ] Zero Knowledge Proofs
- [ ] Account Abstraction completa

### V2.0 (Futuro)
- [ ] Multi-chain completo
- [ ] Marketplace de gift cards
- [ ] Programa de fidelidade
- [ ] API pública

## 📞 Suporte

Para dúvidas técnicas ou suporte:
- Email: ferreiracavazin@gmail.com
- GitHub Issues: [Link do repositório]

## 📄 Licença

MIT License - veja LICENSE para detalhes.

---

Desenvolvido com ❤️ para revolucionar o mercado de gift cards.