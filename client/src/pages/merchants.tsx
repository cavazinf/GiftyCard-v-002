import Navigation from "@/components/navigation";
import MerchantPOS from "@/components/merchant-pos";

export default function Merchants() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel do Comerciante</h1>
          <p className="text-gray-600">Receber pagamentos com Gift Card NFT e processar troco automaticamente</p>
        </div>
        
        <MerchantPOS />
        
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Transações Recentes</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Compra #1247</p>
                  <p className="text-xs text-gray-600">Gift Card: GFC-ABC123</p>
                  <p className="text-xs text-gray-600">há 2 horas</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">$50.00</p>
                  <p className="text-xs text-blue-600">Troco: $25.00 (Novo NFT)</p>
                  <p className="text-xs text-gray-600">Concluído</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Compra #1246</p>
                  <p className="text-xs text-gray-600">Gift Card: GFC-DEF456</p>
                  <p className="text-xs text-gray-600">há 3 horas</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">$100.00</p>
                  <p className="text-xs text-gray-600">Sem troco</p>
                  <p className="text-xs text-gray-600">Concluído</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}