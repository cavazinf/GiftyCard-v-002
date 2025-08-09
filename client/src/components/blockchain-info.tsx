import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatBalance, getBlockchainExplorerUrl } from "@/lib/blockchain";
import type { GiftCard } from "@shared/schema";

interface BlockchainInfoProps {
  giftCard?: GiftCard | null;
}

export default function BlockchainInfo({ giftCard }: BlockchainInfoProps) {
  const handleExplorerClick = () => {
    if (giftCard?.tbaAddress) {
      const explorerUrl = getBlockchainExplorerUrl(giftCard.tbaAddress);
      window.open(explorerUrl, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Informações Blockchain</CardTitle>
      </CardHeader>
      <CardContent>
        {giftCard ? (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rede:</span>
              <span className="text-sm font-medium text-gray-900">Polygon</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">TBA Address:</span>
              <span className="text-sm font-mono text-gray-900">
                {giftCard.tbaAddress ? `${giftCard.tbaAddress.substring(0, 6)}...${giftCard.tbaAddress.substring(giftCard.tbaAddress.length - 4)}` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Saldo USDC:</span>
              <span className="text-sm font-medium text-secondary">
                {formatBalance(giftCard.balance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`text-sm ${
                giftCard.status === 'active' ? 'text-green-600' : 
                giftCard.status === 'redeemed' ? 'text-gray-500' : 
                'text-orange-600'
              }`}>
                {giftCard.status === 'active' && '✓ Ativo'}
                {giftCard.status === 'redeemed' && '✓ Resgatado'}
                {giftCard.status === 'partially_used' && '◐ Parcial'}
                {giftCard.status === 'expired' && '✗ Expirado'}
              </span>
            </div>
            <Button
              onClick={handleExplorerClick}
              variant="secondary"
              className="w-full mt-4"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver no Explorer
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              Selecione um gift card para ver informações blockchain
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
