import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface VerificationResult {
  balance: number;
  tokenId: string;
  valid: boolean;
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
    
    // Simulate balance verification
    setTimeout(() => {
      const mockBalance = 150.00;
      setVerificationResult({
        balance: mockBalance,
        tokenId: giftCardCode,
        valid: true
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
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Receber Pagamento com Gift Card NFT</CardTitle>
          <p className="text-sm text-gray-600">Verificar saldo e processar compra com troco automático</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Gift Card Input */}
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button 
                onClick={handleVerifyBalance}
                disabled={!giftCardCode || isProcessing}
                variant="outline"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Verificar"
                )}
              </Button>
            </div>
          </div>

          {/* Step 2: Balance Display */}
          {verificationResult && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Gift Card Válido</span>
              </div>
              <div className="text-sm text-green-700">
                <p>Token ID: {verificationResult.tokenId}</p>
                <p className="font-medium text-lg">Saldo Disponível: ${verificationResult.balance.toFixed(2)}</p>
              </div>
            </div>
          )}

          {/* Step 3: Purchase Amount */}
          {verificationResult && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor da Compra ($)
              </label>
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                max={verificationResult.balance}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              {purchaseAmount && parseFloat(purchaseAmount) > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Saldo Atual:</span>
                      <span>${verificationResult.balance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valor da Compra:</span>
                      <span>${parseFloat(purchaseAmount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Troco:</span>
                      <span className={verificationResult.balance - parseFloat(purchaseAmount) >= 0 ? "text-green-600" : "text-red-600"}>
                        ${Math.max(0, verificationResult.balance - parseFloat(purchaseAmount)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Process Button */}
          {verificationResult && purchaseAmount && (
            <div className="pt-4 border-t border-gray-200">
              {parseFloat(purchaseAmount) > verificationResult.balance ? (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Saldo insuficiente para esta compra</span>
                </div>
              ) : null}
              
              <Button 
                onClick={handleProcessPurchase}
                disabled={!purchaseAmount || isProcessing || parseFloat(purchaseAmount) > verificationResult.balance || parseFloat(purchaseAmount) <= 0}
                className="w-full bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando Compra...
                  </>
                ) : (
                  "Confirmar Compra"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}