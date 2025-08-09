import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Shield, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { GiftCard, ZkProof } from "@shared/schema";

interface ZKProofDemoProps {
  giftCard?: GiftCard | null;
}

export default function ZKProofDemo({ giftCard }: ZKProofDemoProps) {
  const [lastProof, setLastProof] = useState<ZkProof | null>(null);
  const { toast } = useToast();

  const generateProofMutation = useMutation({
    mutationFn: async (giftCardId: string) => {
      const response = await apiRequest("POST", `/api/gift-cards/${giftCardId}/zk-proof`, {});
      return response.json();
    },
    onSuccess: (proof: ZkProof) => {
      setLastProof(proof);
      toast({
        title: "ZK Proof gerada com sucesso!",
        description: "Prova de saldo verificada sem revelar informações sensíveis.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao gerar ZK Proof",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateProof = () => {
    if (giftCard) {
      generateProofMutation.mutate(giftCard.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">ZK Proof Privacy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Prova de Saldo</h4>
            <p className="text-sm text-purple-700">
              Prove que possui saldo suficiente sem revelar o valor exato
            </p>
          </div>
          
          <Button
            onClick={handleGenerateProof}
            disabled={!giftCard || generateProofMutation.isPending}
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
          >
            {generateProofMutation.isPending ? (
              <>
                <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                Gerando ZK Proof...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Gerar ZK Proof
              </>
            )}
          </Button>
          
          <div className="text-xs text-gray-500 text-center">
            {lastProof ? (
              <div className="flex items-center justify-center space-x-1 text-green-600">
                <Check className="w-3 h-3" />
                <span>Prova gerada: ✓ Válida</span>
              </div>
            ) : (
              <span>Nenhuma prova gerada ainda</span>
            )}
          </div>
          
          {lastProof && (
            <div className="bg-gray-50 p-3 rounded text-xs">
              <p className="font-mono text-gray-700">
                Commitment: {(lastProof.proofData as any)?.commitment?.substring(0, 20)}...
              </p>
              <p className="text-gray-500 mt-1">
                Gerado: {new Date(lastProof.createdAt!).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
