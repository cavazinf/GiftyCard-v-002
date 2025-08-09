import { useState } from "react";
import { Download, QrCode as QrCodeIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateGiftCardQR, downloadQRCode } from "@/lib/qr-utils";
import type { GiftCard } from "@shared/schema";

interface QRCodeDisplayProps {
  giftCard?: GiftCard | null;
}

export default function QRCodeDisplay({ giftCard }: QRCodeDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!giftCard) return;
    
    setIsDownloading(true);
    
    const qrDataUrl = generateGiftCardQR(giftCard.tokenId);
    downloadQRCode(qrDataUrl, `gift-card-${giftCard.tokenId.substring(giftCard.tokenId.length - 6)}.svg`);
    
    setTimeout(() => setIsDownloading(false), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <QrCodeIcon className="w-5 h-5 mr-2" />
          QR Code para Resgate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            {giftCard ? (
              <img
                src={generateGiftCardQR(giftCard.tokenId)}
                alt={`QR Code for ${giftCard.title}`}
                className="w-40 h-40 rounded"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-200 rounded flex items-center justify-center">
                <QrCodeIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          
          {giftCard ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Gift Card ID: #{giftCard.tokenId.substring(giftCard.tokenId.length - 6)}
              </p>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-primary text-white hover:bg-indigo-700"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Baixando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Baixar QR Code
                  </>
                )}
              </Button>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Selecione um gift card para ver o QR code
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
