import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Power, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useConnect, useDisconnect, useBalance, useChainId } from 'wagmi';
import { supportedChains } from '@/config/wagmi';

export const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const chainId = useChainId();
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      const metamaskConnector = connectors.find(connector => 
        connector.name.toLowerCase().includes('metamask') || 
        connector.name.toLowerCase().includes('injected')
      );
      
      if (metamaskConnector) {
        connect({ connector: metamaskConnector });
      } else {
        toast({
          title: "MetaMask não encontrada",
          description: "Por favor, instale o MetaMask para continuar.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao conectar",
        description: "Falha ao conectar com a carteira.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    disconnect();
    toast({
      title: "Carteira desconectada",
      description: "Carteira desconectada com sucesso.",
    });
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Endereço copiado!",
        description: "Endereço da carteira copiado para a área de transferência.",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getCurrentNetwork = () => {
    return supportedChains.find(chain => chain.id === chainId) || {
      id: chainId,
      name: `Chain ${chainId}`,
      symbol: 'ETH',
      blockExplorer: '',
    };
  };

  const openInExplorer = () => {
    const network = getCurrentNetwork();
    if (network.blockExplorer && address) {
      window.open(`${network.blockExplorer}/address/${address}`, '_blank');
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      toast({
        title: "Carteira conectada!",
        description: `Conectado com sucesso: ${formatAddress(address)}`,
      });
    }
  }, [isConnected, address, toast]);

  return (
    <Card className="gradient-card border-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Conectar Carteira
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <Button
            onClick={connectWallet}
            disabled={isPending}
            className="w-full gradient-primary hover:shadow-neon"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                Conectando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Conectar MetaMask
              </div>
            )}
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="border-primary text-primary glow-primary">
                <CheckCircle className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnectWallet}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                <Power className="h-3 w-3 mr-1" />
                Desconectar
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Endereço:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{address && formatAddress(address)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {getCurrentNetwork().blockExplorer && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={openInExplorer}
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Rede:</span>
                <span className="text-sm font-medium">{getCurrentNetwork().name}</span>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Saldo:</span>
                <span className="text-sm font-medium">
                  {balance ? `${Number(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH'}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};