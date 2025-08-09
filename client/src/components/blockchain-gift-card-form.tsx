import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useChainId } from 'wagmi';
import { createGiftCard, parseUSDC, type CreateGiftCardParams } from '@/lib/contract-utils';
import { Coins, Loader2 } from 'lucide-react';
import { type Address } from 'viem';

const formSchema = z.object({
  recipient: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Endereço Ethereum inválido'),
  amount: z.string().min(1, 'Valor é obrigatório').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Valor deve ser maior que 0'
  ),
  expirationMonths: z.string().min(1, 'Período de expiração é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

type FormData = z.infer<typeof formSchema>;

interface BlockchainGiftCardFormProps {
  onSuccess?: (tokenId: bigint, tbaAddress: Address) => void;
}

export function BlockchainGiftCardForm({ onSuccess }: BlockchainGiftCardFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: '',
      amount: '',
      expirationMonths: '12',
      category: 'Geral',
      description: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!isConnected || !address) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira para criar gift cards.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const params: CreateGiftCardParams = {
        to: data.recipient as Address,
        balance: parseUSDC(data.amount),
        expirationMonths: parseInt(data.expirationMonths),
        category: data.category,
        uri: `data:application/json,${encodeURIComponent(JSON.stringify({
          name: `GIFTY Card - ${data.category}`,
          description: data.description,
          image: 'https://via.placeholder.com/400x250/6366f1/ffffff?text=GIFTY+Card',
          attributes: [
            { trait_type: 'Category', value: data.category },
            { trait_type: 'Amount', value: data.amount },
            { trait_type: 'Expiration', value: `${data.expirationMonths} meses` },
          ],
        }))}`,
      };

      const result = await createGiftCard(chainId, params);

      toast({
        title: "Gift Card criado!",
        description: `Token ID: ${result.tokenId.toString()}`,
      });

      form.reset();
      onSuccess?.(result.tokenId, result.tbaAccount);
    } catch (error) {
      console.error('Erro ao criar gift card:', error);
      toast({
        title: "Erro ao criar gift card",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="gradient-card border-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            Criar Gift Card Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <div className="text-muted-foreground mb-4">
              Conecte sua carteira para criar gift cards na blockchain
            </div>
            <Button disabled className="w-full">
              Conectar Carteira Primeiro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          Criar Gift Card Blockchain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço do Destinatário</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0x..."
                      {...field}
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (USDC)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="100.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expirationMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade (meses)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a validade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3">3 meses</SelectItem>
                      <SelectItem value="6">6 meses</SelectItem>
                      <SelectItem value="12">12 meses</SelectItem>
                      <SelectItem value="24">24 meses</SelectItem>
                      <SelectItem value="36">36 meses</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Geral">Geral</SelectItem>
                      <SelectItem value="Restaurante">Restaurante</SelectItem>
                      <SelectItem value="Moda">Moda</SelectItem>
                      <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                      <SelectItem value="Saúde">Saúde e Beleza</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva este gift card..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full gradient-primary hover:shadow-neon"
              disabled={isCreating}
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando na Blockchain...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Criar Gift Card
                </div>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}