import Navigation from "@/components/navigation";
import MerchantPOS from "@/components/merchant-pos";

export default function Merchants() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation user={{ name: "João Silva", email: "joao@exemplo.com" }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel do Comerciante</h1>
          <p className="text-gray-600">Integração POS e processamento de resgates</p>
        </div>
        
        <MerchantPOS />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuração POS</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID do Terminal
                </label>
                <input 
                  type="text" 
                  placeholder="12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL
                </label>
                <input 
                  type="url" 
                  placeholder="https://api.exemplo.com/webhook"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Salvar Configurações
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Transações</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Resgate #1247</p>
                  <p className="text-xs text-gray-600">há 2 horas</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">$50.00</p>
                  <p className="text-xs text-gray-600">Concluído</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Resgate #1246</p>
                  <p className="text-xs text-gray-600">há 4 horas</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">$25.50</p>
                  <p className="text-xs text-gray-600">Concluído</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Resgate #1245</p>
                  <p className="text-xs text-gray-600">há 1 dia</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">$100.00</p>
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
