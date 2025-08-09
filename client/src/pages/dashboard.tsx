import { useState } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import GiftCardForm from "@/components/gift-card-form";
import GiftCardList from "@/components/gift-card-list";
import QRCodeDisplay from "@/components/qr-code-display";
import BlockchainInfo from "@/components/blockchain-info";
import ZKProofDemo from "@/components/zk-proof-demo";
import MerchantPOS from "@/components/merchant-pos";
import { WalletConnect } from "@/components/wallet-connect";
import { BlockchainGiftCardForm } from "@/components/blockchain-gift-card-form";
import type { GiftCard } from "@shared/schema";

export default function Dashboard() {
  const [selectedGiftCard, setSelectedGiftCard] = useState<GiftCard | null>(null);
  
  // Mock user ID - in production this would come from authentication
  const mockUserId = "user-123";

  const handleQRClick = (giftCard: GiftCard) => {
    setSelectedGiftCard(giftCard);
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      <Navigation user={{ name: "João Silva", email: "joao@exemplo.com" }} />
      <HeroSection />
      <StatsSection />
      
      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Gift Card Creation and List */}
          <div className="lg:col-span-2 space-y-8">
            <BlockchainGiftCardForm onSuccess={(tokenId, tbaAddress) => {
              console.log('Gift card criado:', { tokenId, tbaAddress });
            }} />
            <GiftCardForm ownerId={mockUserId} />
            <GiftCardList ownerId={mockUserId} onQRClick={handleQRClick} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <WalletConnect />
            <QRCodeDisplay giftCard={selectedGiftCard} />
            <BlockchainInfo giftCard={selectedGiftCard} />
            <ZKProofDemo giftCard={selectedGiftCard} />
          </div>
        </div>

        {/* Merchant Dashboard Section */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Painel do Comerciante</h2>
            <MerchantPOS />
          </div>
        </div>

        {/* Technology Demo Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Demonstração da Tecnologia</h2>
            <p className="text-indigo-100 mb-6">
              Explore as inovações tecnológicas que tornam o GIFTY possível
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="text-2xl mb-3">🔗</div>
                <h3 className="font-semibold mb-2">ERC-6551 TBA</h3>
                <p className="text-sm text-indigo-100 mb-3">
                  Token Bound Accounts vinculam saldo diretamente ao NFT
                </p>
                <button className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded hover:bg-opacity-30 transition-colors">
                  Ver Código
                </button>
              </div>
              
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="text-2xl mb-3">🛡️</div>
                <h3 className="font-semibold mb-2">ERC-4337 AA</h3>
                <p className="text-sm text-indigo-100 mb-3">
                  Account Abstraction permite uso sem carteira cripto
                </p>
                <button className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded hover:bg-opacity-30 transition-colors">
                  Testar Demo
                </button>
              </div>
              
              <div className="bg-white bg-opacity-10 p-6 rounded-lg">
                <div className="text-2xl mb-3">👁️‍🗨️</div>
                <h3 className="font-semibold mb-2">ZK Proofs</h3>
                <p className="text-sm text-indigo-100 mb-3">
                  Privacidade total: prove saldo sem revelar valor
                </p>
                <button className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded hover:bg-opacity-30 transition-colors">
                  Gerar Prova
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎁</span>
                </div>
                <span className="ml-2 text-xl font-bold">GIFTY</span>
              </div>
              <p className="text-gray-400 text-sm">
                A próxima geração de gift cards utilizando tecnologia blockchain
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Recursos</a></li>
                <li><a href="#" className="hover:text-white">Preços</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Documentação</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Sobre</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Carreiras</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Comunidade</a></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 GIFTY. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white">Discord</a>
              <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
