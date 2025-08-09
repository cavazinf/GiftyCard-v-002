import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Zap, Settings, Loader2 } from "lucide-react";

export default function MerchantPOS() {
  const [redemptionCode, setRedemptionCode] = useState("");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessRedemption = () => {
    if (!redemptionCode || !amount) return;
    
    setIsProcessing(true);
    
    // Simulate POS processing
    setTimeout(() => {
      setIsProcessing(false);
      setRedemptionCode("");
      setAmount("");
      alert("Resgate processado com sucesso!");
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* POS Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Integração POS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-center mb-4">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Terminal POS Conectado</h4>
              <p className="text-sm text-gray-600">Terminal 12345</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge className="bg-green-100 text-green-600">
                  <Zap className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Último Ping:</span>
                <span className="text-sm text-gray-900">há 30s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transações Hoje:</span>
                <span className="text-sm text-gray-900">23</span>
              </div>
            </div>
            
            <Button className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700">
              <Settings className="w-4 h-4 mr-2" />
              Configurar Terminal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Redemption Flow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Processar Resgate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Resgate
              </label>
              <input
                type="text"
                value={redemptionCode}
                onChange={(e) => setRedemptionCode(e.target.value)}
                placeholder="GFC-ABC123"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Resgate ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25.00"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                ℹ️ O valor será debitado automaticamente do saldo do gift card após confirmação.
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Button 
                onClick={handleProcessRedemption}
                disabled={!redemptionCode || !amount || isProcessing}
                className="w-full bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Processar Resgate"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}