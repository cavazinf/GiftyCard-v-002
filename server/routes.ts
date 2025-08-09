import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGiftCardSchema, insertTransactionSchema, insertZkProofSchema } from "@shared/schema";
import { z } from "zod";
// Mock blockchain utilities - moved to server side for proper imports
function generateTokenId(): string {
  return `GFC-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

function generateTBAAddress(tokenId: string): string {
  const hash = tokenId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `0x${hash.toString(16).padStart(40, '0')}`;
}

function generateQRCode(tokenId: string): string {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <rect x="10" y="10" width="180" height="180" fill="black"/>
      <rect x="20" y="20" width="160" height="160" fill="white"/>
      <text x="100" y="105" text-anchor="middle" font-family="monospace" font-size="8">${tokenId}</text>
    </svg>
  `)}`;
}

async function mockBlockchainInteraction(operation: string, data: any): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`[Blockchain] ${operation}:`, data);
  
  switch (operation) {
    case 'createGiftCard':
      return {
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        tokenId: data.tokenId,
        tbaAddress: generateTBAAddress(data.tokenId),
        gasUsed: Math.floor(Math.random() * 100000) + 50000,
        status: 'confirmed'
      };
    case 'redeemGiftCard':
      return {
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        amount: data.amount,
        merchant: data.merchant,
        gasUsed: Math.floor(Math.random() * 80000) + 40000,
        status: 'confirmed'
      };
    case 'reloadGiftCard':
      return {
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        amount: data.amount,
        gasUsed: Math.floor(Math.random() * 60000) + 30000,
        status: 'confirmed'
      };
    default:
      return { status: 'unknown_operation' };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Gift Cards routes
  app.get("/api/gift-cards", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      const giftCards = await storage.getGiftCardsByOwner(userId);
      res.json(giftCards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gift cards" });
    }
  });

  app.get("/api/gift-cards/:id", async (req, res) => {
    try {
      const giftCard = await storage.getGiftCard(req.params.id);
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card not found" });
      }
      res.json(giftCard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gift card" });
    }
  });

  app.post("/api/gift-cards", async (req, res) => {
    try {
      const validatedData = insertGiftCardSchema.parse(req.body);
      
      // Generate blockchain-specific data
      const tokenId = generateTokenId();
      const tbaAddress = generateTBAAddress(tokenId);
      const qrCode = generateQRCode(tokenId);
      
      // Mock blockchain interaction
      await mockBlockchainInteraction('createGiftCard', {
        tokenId,
        balance: validatedData.balance,
        recipient: validatedData.recipientEmail
      });
      
      const giftCard = await storage.createGiftCard({
        ...validatedData,
        tokenId,
        tbaAddress,
        qrCode
      });
      
      // Create initial transaction
      await storage.createTransaction({
        giftCardId: giftCard.id,
        type: 'creation',
        amount: validatedData.balance,
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        status: 'confirmed'
      });
      
      res.json(giftCard);
    } catch (error) {
      console.error('Error creating gift card:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid gift card data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create gift card" });
    }
  });

  app.put("/api/gift-cards/:id/redeem", async (req, res) => {
    try {
      const { amount, merchantId } = req.body;
      const giftCard = await storage.getGiftCard(req.params.id);
      
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card not found" });
      }
      
      const currentBalance = parseFloat(giftCard.balance);
      const redeemAmount = parseFloat(amount);
      
      if (currentBalance < redeemAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      const newBalance = currentBalance - redeemAmount;
      const status = newBalance === 0 ? 'redeemed' : 'partially_used';
      
      // Mock blockchain interaction
      await mockBlockchainInteraction('redeemGiftCard', {
        tokenId: giftCard.tokenId,
        amount: redeemAmount,
        merchant: merchantId
      });
      
      const updatedGiftCard = await storage.updateGiftCard(req.params.id, {
        balance: newBalance.toString(),
        status,
        redeemedAt: status === 'redeemed' ? new Date() : giftCard.redeemedAt
      });
      
      // Create redemption transaction
      await storage.createTransaction({
        giftCardId: giftCard.id,
        merchantId,
        type: 'redemption',
        amount: redeemAmount.toString(),
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        status: 'confirmed'
      });
      
      res.json(updatedGiftCard);
    } catch (error) {
      res.status(500).json({ message: "Failed to redeem gift card" });
    }
  });

  app.put("/api/gift-cards/:id/reload", async (req, res) => {
    try {
      const { amount } = req.body;
      const giftCard = await storage.getGiftCard(req.params.id);
      
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card not found" });
      }
      
      const currentBalance = parseFloat(giftCard.balance);
      const reloadAmount = parseFloat(amount);
      const newBalance = currentBalance + reloadAmount;
      
      // Mock blockchain interaction
      await mockBlockchainInteraction('reloadGiftCard', {
        tokenId: giftCard.tokenId,
        amount: reloadAmount
      });
      
      const updatedGiftCard = await storage.updateGiftCard(req.params.id, {
        balance: newBalance.toString(),
        status: 'active'
      });
      
      // Create reload transaction
      await storage.createTransaction({
        giftCardId: giftCard.id,
        type: 'reload',
        amount: reloadAmount.toString(),
        txHash: `0x${Math.random().toString(16).substring(2)}`,
        status: 'confirmed'
      });
      
      res.json(updatedGiftCard);
    } catch (error) {
      res.status(500).json({ message: "Failed to reload gift card" });
    }
  });

  // Transactions routes
  app.get("/api/gift-cards/:id/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByGiftCard(req.params.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // ZK Proofs routes
  app.post("/api/gift-cards/:id/zk-proof", async (req, res) => {
    try {
      const giftCard = await storage.getGiftCard(req.params.id);
      if (!giftCard) {
        return res.status(404).json({ message: "Gift card not found" });
      }
      
      // Generate mock ZK proof
      const proofData = {
        balance_proof: `zk_proof_${Math.random().toString(36).substring(7)}`,
        commitment: `0x${Math.random().toString(16).substring(2, 66)}`,
        nullifier: `0x${Math.random().toString(16).substring(2, 66)}`,
        verified: true,
        timestamp: Date.now()
      };
      
      const zkProof = await storage.createZkProof({
        giftCardId: req.params.id,
        proofData,
        verified: true
      });
      
      res.json(zkProof);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate ZK proof" });
    }
  });

  // Merchants routes
  app.get("/api/merchants", async (req, res) => {
    try {
      const merchants = await storage.getActiveMerchants();
      res.json(merchants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchants" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      // Mock analytics data - in production, this would aggregate from the database
      const stats = {
        totalCards: 1247,
        totalValue: 234567,
        merchants: 89,
        avgTime: "< 1min",
        emissionCost: "0.3%",
        redemptionTime: "< 45s",
        uxSuccess: "92%",
        zkProofs: "100%"
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
