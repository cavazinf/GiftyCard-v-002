import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2, CheckCircle, Shield, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { InsertGiftCard } from "@shared/schema";

const giftCardSchema = z.object({
  recipientEmail: z.string().email("Email inválido"),
  balance: z.string().min(1, "Valor obrigatório").refine(val => parseFloat(val) > 0, "Valor deve ser maior que 0"),
  title: z.string().min(1, "Título obrigatório"),
  message: z.string().optional(),
  category: z.string().min(1, "Categoria obrigatória"),
  expiresAt: z.string().min(1, "Validade obrigatória"),
});

type GiftCardFormData = z.infer<typeof giftCardSchema>;

interface GiftCardFormProps {
  ownerId: string;
  onSuccess?: () => void;
}

export default function GiftCardForm({ ownerId, onSuccess }: GiftCardFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<GiftCardFormData>({
    resolver: zodResolver(giftCardSchema),
    defaultValues: {
      recipientEmail: "",
      balance: "",
      title: "",
      message: "",
      category: "general",
      expiresAt: "1-year",
    },
  });

  const createGiftCardMutation = useMutation({
    mutationFn: async (data: GiftCardFormData) => {
      const expiresAt = new Date();
      switch (data.expiresAt) {
        case "3-months":
          expiresAt.setMonth(expiresAt.getMonth() + 3);
          break;
        case "6-months":
          expiresAt.setMonth(expiresAt.getMonth() + 6);
          break;
        case "1-year":
        default:
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          break;
      }

      const giftCardData: Omit<InsertGiftCard, "ownerId"> & { ownerId: string } = {
        ownerId,
        recipientEmail: data.recipientEmail,
        title: data.title,
        message: data.message || "",
        balance: data.balance,
        originalBalance: data.balance,
        category: data.category,
        status: "active",
        expiresAt,
      };

      const response = await apiRequest("POST", "/api/gift-cards", giftCardData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gift-cards"] });
      toast({
        title: "Gift Card criado com sucesso!",
        description: "O NFT foi criado e a TBA foi configurada automaticamente.",
      });
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar Gift Card",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      console.error("Error creating gift card:", error);
    },
  });

  const onSubmit = (data: GiftCardFormData) => {
    createGiftCardMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Criar Novo Gift Card NFT</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destinatário</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (USDC)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="100.00" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Gift Card</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Gift Card Restaurante" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem Personalizada</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Feliz aniversário! Aproveite este gift card..." 
                      className="h-24 resize-none" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">Geral</SelectItem>
                        <SelectItem value="restaurant">Restaurante</SelectItem>
                        <SelectItem value="online-store">Loja Online</SelectItem>
                        <SelectItem value="services">Serviços</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a validade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-year">1 ano</SelectItem>
                        <SelectItem value="6-months">6 meses</SelectItem>
                        <SelectItem value="3-months">3 meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Tecnologia Blockchain</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-secondary mr-2" />
                  ERC-6551 Token Bound Account será criada automaticamente
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-primary mr-2" />
                  Saldo gerenciado por smart contract seguro
                </div>
                <div className="flex items-center">
                  <EyeOff className="w-4 h-4 text-accent mr-2" />
                  Privacidade garantida com ZK Proofs
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary text-white py-3 px-6 hover:bg-indigo-700"
              disabled={createGiftCardMutation.isPending}
            >
              {createGiftCardMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Criando...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Criar Gift Card NFT
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
