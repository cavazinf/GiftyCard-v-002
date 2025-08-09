import { useQuery } from "@tanstack/react-query";
import { Gift, ShoppingBag, Check, QrCode, Share, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBalance } from "@/lib/blockchain";
import type { GiftCard } from "@shared/schema";

interface GiftCardListProps {
  ownerId: string;
  onQRClick?: (giftCard: GiftCard) => void;
}

export default function GiftCardList({ ownerId, onQRClick }: GiftCardListProps) {
  const { data: giftCards, isLoading, error } = useQuery<GiftCard[]>({
    queryKey: ["/api/gift-cards", { userId: ownerId }],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "partially_used":
        return "bg-orange-100 text-orange-800";
      case "redeemed":
        return "bg-gray-100 text-gray-600";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "partially_used":
        return "Parcialmente Usado";
      case "redeemed":
        return "Resgatado";
      case "expired":
        return "Expirado";
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "restaurant":
        return <Gift className="w-5 h-5 text-white" />;
      case "online-store":
        return <ShoppingBag className="w-5 h-5 text-white" />;
      default:
        return <Gift className="w-5 h-5 text-white" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "restaurant":
        return "from-primary to-secondary";
      case "online-store":
        return "from-accent to-orange-500";
      default:
        return "from-primary to-secondary";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Meus Gift Cards</h2>
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-red-600">Erro ao carregar gift cards</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!giftCards || giftCards.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Meus Gift Cards</h2>
          </div>
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum Gift Card encontrado</h3>
            <p className="text-gray-500 mb-6">Crie seu primeiro gift card NFT para começar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Meus Gift Cards</h2>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm">Todos</Button>
            <Button variant="ghost" size="sm">Ativos</Button>
            <Button variant="ghost" size="sm">Resgatados</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {giftCards.map((giftCard) => (
            <div 
              key={giftCard.id} 
              className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                giftCard.status === 'redeemed' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryGradient(giftCard.category)} rounded-lg flex items-center justify-center`}>
                    {giftCard.status === 'redeemed' ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      getCategoryIcon(giftCard.category)
                    )}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${giftCard.status === 'redeemed' ? 'text-gray-500' : 'text-gray-900'}`}>
                      {giftCard.title}
                    </h3>
                    <p className={`text-sm ${giftCard.status === 'redeemed' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Para: {giftCard.recipientEmail}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`text-lg font-bold ${
                        giftCard.status === 'redeemed' ? 'text-gray-400' : 'text-secondary'
                      }`}>
                        {formatBalance(giftCard.balance)}
                      </span>
                      <Badge className={getStatusColor(giftCard.status)}>
                        {getStatusLabel(giftCard.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${giftCard.status === 'redeemed' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Token ID: #{giftCard.tokenId.substring(giftCard.tokenId.length - 6)}
                  </p>
                  <p className={`text-sm ${giftCard.status === 'redeemed' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {giftCard.redeemedAt 
                      ? `Resgatado: ${new Date(giftCard.redeemedAt).toLocaleDateString()}`
                      : `Criado: ${new Date(giftCard.createdAt!).toLocaleDateString()}`
                    }
                  </p>
                  <div className="mt-2 space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onQRClick?.(giftCard)}
                      disabled={giftCard.status === 'redeemed'}
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      QR Code
                    </Button>
                    {giftCard.status === 'active' && (
                      <Button variant="ghost" size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Recarregar
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Share className="w-4 h-4 mr-1" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
