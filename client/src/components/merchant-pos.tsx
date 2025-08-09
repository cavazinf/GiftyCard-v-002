import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, CheckCircle, AlertCircle, Loader2, CreditCard, Percent, DollarSign } from "lucide-react";

interface VerificationResult {
  balance: number;
  tokenId: string;
  valid: boolean;
  originalValue: number;
  category: string;
  image: string;
}

interface TransactionResult {
  originalBalance: number;
  purchaseAmount: number;
  change: number;
  changeNFT: string | null;
  success: boolean;
}

export default function MerchantPOS() {
  const [giftCardCode, setGiftCardCode] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [transactionComplete, setTransactionComplete] = useState<TransactionResult | false>(false);

  const handleVerifyBalance = async () => {
    if (!giftCardCode) return;
    
    setIsProcessing(true);
    
    // Simulate balance verification with marketplace-style data
    setTimeout(() => {
      const categories = ["Alimentação", "Entretenimento", "Compras", "Serviços"];
      const images = [
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
        "https://images.unsplash.com/photo-1489599611748-ebdea1b87e96?w=400",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
        "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400"
      ];
      
      const mockBalance = 250.00;
      const mockOriginalValue = 500.00;
      
      setVerificationResult({
        balance: mockBalance,
        tokenId: giftCardCode,
        valid: true,
        originalValue: mockOriginalValue,
        category: categories[Math.floor(Math.random() * categories.length)],
        image: images[Math.floor(Math.random() * images.length)]
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleProcessPurchase = async () => {
    if (!purchaseAmount || !verificationResult) return;
    
    setIsProcessing(true);
    
    // Simulate purchase processing with change calculation
    setTimeout(() => {
      const balance = verificationResult.balance;
      const amount = parseFloat(purchaseAmount);
      const change = balance - amount;
      
      setTransactionComplete({
        originalBalance: balance,
        purchaseAmount: amount,
        change: change > 0 ? change : 0,
        changeNFT: change > 0 ? `GFC-CHG-${Date.now()}` : null,
        success: balance >= amount
      });
      
      if (balance >= amount) {
        setGiftCardCode("");
        setPurchaseAmount("");
        setVerificationResult(null);
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  const resetTransaction = () => {
    setTransactionComplete(false);
    setVerificationResult(null);
    setGiftCardCode("");
    setPurchaseAmount("");
  };

  if (transactionComplete) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-green-600 flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6" />
            {transactionComplete.success ? "Transação Concluída!" : "Saldo Insuficiente"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Saldo Original:</span>
              <span className="font-medium">${transactionComplete.originalBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Valor da Compra:</span>
              <span className="font-medium">${transactionComplete.purchaseAmount.toFixed(2)}</span>
            </div>
            {transactionComplete.success && (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Troco:</span>
                  <span className="font-medium">${transactionComplete.change.toFixed(2)}</span>
                </div>
                {transactionComplete.changeNFT && (
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Novo NFT de Troco Criado</span>
                    </div>
                    <p className="text-sm text-blue-700">Token ID: {transactionComplete.changeNFT}</p>
                    <p className="text-xs text-blue-600 mt-1">
                      O cliente pode usar este novo gift card NFT com o saldo restante
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          
          <Button onClick={resetTransaction} className="w-full">
            Nova Transação
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Input and Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Terminal de Pagamento
              </CardTitle>
              <p className="text-sm text-gray-600">Escaneie ou digite o código do gift card NFT</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código do Gift Card NFT
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value)}
                    placeholder="GFC-ABC123"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
                  />
                  <Button 
                    onClick={handleVerifyBalance}
                    disabled={!giftCardCode || isProcessing}
                    className="px-6 py-3"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Verificar"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Amount Input */}
          {verificationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Valor da Compra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Total (R$)
                  </label>
                  <input
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max={verificationResult.balance}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-xl font-semibold"
                  />
                </div>
                
                {purchaseAmount && parseFloat(purchaseAmount) > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Resumo da Transação</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Saldo Atual:</span>
                        <span className="font-medium">R$ {verificationResult.balance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Valor da Compra:</span>
                        <span className="font-medium">R$ {parseFloat(purchaseAmount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium text-blue-800">Troco:</span>
                        <span className={`font-bold ${verificationResult.balance - parseFloat(purchaseAmount) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          R$ {Math.max(0, verificationResult.balance - parseFloat(purchaseAmount)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Process Button */}
                <div className="pt-2">
                  {parseFloat(purchaseAmount || "0") > verificationResult.balance ? (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg mb-3">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Saldo insuficiente para esta compra</span>
                    </div>
                  ) : null}
                  
                  <Button 
                    onClick={handleProcessPurchase}
                    disabled={!purchaseAmount || isProcessing || parseFloat(purchaseAmount || "0") > verificationResult.balance || parseFloat(purchaseAmount || "0") <= 0}
                    className="w-full bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 py-3 text-lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processando Compra...
                      </>
                    ) : (
                      "Confirmar Pagamento"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side - Gift Card Display */}
        <div className="space-y-6">

          {/* Step 2: Gift Card Display - Marketplace Style */}
          {verificationResult && (
            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img 
                  src={verificationResult.image} 
                  alt="Gift Card" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-100 text-green-600 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Válido
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90">
                    {verificationResult.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Gift Card #{verificationResult.tokenId.slice(-6)}</h3>
                  <span className="text-sm text-gray-500">Token ID: {verificationResult.tokenId}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Saldo Disponível</span>
                    </div>
                    <p className="text-xl font-bold text-blue-900">
                      R$ {verificationResult.balance.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Percent className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Valor Original</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      R$ {verificationResult.originalValue.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.round((verificationResult.balance / verificationResult.originalValue) * 100)}% disponível
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}