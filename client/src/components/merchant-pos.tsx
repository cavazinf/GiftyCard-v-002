import { useState } from "react";
import { CreditCard, Settings, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
          <CardTitle className="text-lg font-semibold text-gray-900">Integração POS Cielo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-center mb-4">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Terminal POS Conectado</h4>
              <p className="text-sm text-gray-600">Cielo LIO - Terminal 12345</p>
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
          <CardTitle className="text-lg font-semibold text-gray-900">Fluxo de Resgate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">1. Cliente apresenta QR</span>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              <p className="text-xs text-gray-600">Cliente mostra o QR code do gift card</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">2. Verificação ZK</span>
                <div className="w-6 h-6 bg-purple-200 rounded"></div>
              </div>
              <p className="text-xs text-gray-600">Sistema verifica saldo com privacidade</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">3. Liquidação USDC</span>
                <div className="w-6 h-6 bg-green-200 rounded"></div>
              </div>
              <p className="text-xs text-gray-600">Valor transferido instantaneamente</p>
            </div>
          </div>
          
          {/* Mock Redemption Simulator */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Simulador de Resgate</h4>
            <div className="space-y-2">
              <Input
                placeholder="Código do Gift Card"
                value={redemptionCode}
                onChange={(e) => setRedemptionCode(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Valor a resgatar (USDC)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button
                onClick={handleProcessRedemption}
                disabled={isProcessing || !redemptionCode || !amount}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
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
