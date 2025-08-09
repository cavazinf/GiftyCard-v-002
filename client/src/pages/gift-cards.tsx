import Navigation from "@/components/navigation";
import GiftCardForm from "@/components/gift-card-form";
import GiftCardList from "@/components/gift-card-list";

export default function GiftCards() {
  // Mock user ID - in production this would come from authentication
  const mockUserId = "user-123";

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation user={{ name: "João Silva", email: "joao@exemplo.com" }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gift Cards</h1>
          <p className="text-gray-600">Gerencie seus gift cards NFT</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GiftCardForm ownerId={mockUserId} />
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajuda</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900">Como funciona?</h4>
                  <p className="text-gray-600">Cada gift card é um NFT único com Token Bound Account</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Segurança</h4>
                  <p className="text-gray-600">Saldo gerenciado por smart contracts auditados</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Privacidade</h4>
                  <p className="text-gray-600">ZK Proofs garantem privacidade total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <GiftCardList ownerId={mockUserId} />
        </div>
      </div>
    </div>
  );
}
