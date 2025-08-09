import { 
  users, giftCards, merchants, transactions, zkProofs,
  type User, type InsertUser, 
  type GiftCard, type InsertGiftCard,
  type Merchant, type InsertMerchant,
  type Transaction, type InsertTransaction,
  type ZkProof, type InsertZkProof
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Gift Cards
  getGiftCard(id: string): Promise<GiftCard | undefined>;
  getGiftCardByTokenId(tokenId: string): Promise<GiftCard | undefined>;
  getGiftCardsByOwner(ownerId: string): Promise<GiftCard[]>;
  createGiftCard(giftCard: InsertGiftCard & { tokenId: string; tbaAddress?: string; qrCode?: string }): Promise<GiftCard>;
  updateGiftCard(id: string, updates: Partial<GiftCard>): Promise<GiftCard>;
  
  // Merchants
  getMerchant(id: string): Promise<Merchant | undefined>;
  getMerchantByUserId(userId: string): Promise<Merchant | undefined>;
  createMerchant(merchant: InsertMerchant): Promise<Merchant>;
  getActiveMerchants(): Promise<Merchant[]>;
  
  // Transactions
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByGiftCard(giftCardId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // ZK Proofs
  createZkProof(zkProof: InsertZkProof): Promise<ZkProof>;
  getZkProofsByGiftCard(giftCardId: string): Promise<ZkProof[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Gift Cards
  async getGiftCard(id: string): Promise<GiftCard | undefined> {
    const [giftCard] = await db.select().from(giftCards).where(eq(giftCards.id, id));
    return giftCard || undefined;
  }

  async getGiftCardByTokenId(tokenId: string): Promise<GiftCard | undefined> {
    const [giftCard] = await db.select().from(giftCards).where(eq(giftCards.tokenId, tokenId));
    return giftCard || undefined;
  }

  async getGiftCardsByOwner(ownerId: string): Promise<GiftCard[]> {
    return await db.select().from(giftCards)
      .where(eq(giftCards.ownerId, ownerId))
      .orderBy(desc(giftCards.createdAt));
  }

  async createGiftCard(insertGiftCard: InsertGiftCard & { tokenId: string; tbaAddress?: string; qrCode?: string }): Promise<GiftCard> {
    const [giftCard] = await db
      .insert(giftCards)
      .values(insertGiftCard)
      .returning();
    return giftCard;
  }

  async updateGiftCard(id: string, updates: Partial<GiftCard>): Promise<GiftCard> {
    const [giftCard] = await db
      .update(giftCards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(giftCards.id, id))
      .returning();
    return giftCard;
  }

  // Merchants
  async getMerchant(id: string): Promise<Merchant | undefined> {
    const [merchant] = await db.select().from(merchants).where(eq(merchants.id, id));
    return merchant || undefined;
  }

  async getMerchantByUserId(userId: string): Promise<Merchant | undefined> {
    const [merchant] = await db.select().from(merchants).where(eq(merchants.userId, userId));
    return merchant || undefined;
  }

  async createMerchant(insertMerchant: InsertMerchant): Promise<Merchant> {
    const [merchant] = await db
      .insert(merchants)
      .values(insertMerchant)
      .returning();
    return merchant;
  }

  async getActiveMerchants(): Promise<Merchant[]> {
    return await db.select().from(merchants).where(eq(merchants.isActive, true));
  }

  // Transactions
  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async getTransactionsByGiftCard(giftCardId: string): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .where(eq(transactions.giftCardId, giftCardId))
      .orderBy(desc(transactions.createdAt));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  // ZK Proofs
  async createZkProof(insertZkProof: InsertZkProof): Promise<ZkProof> {
    const [zkProof] = await db
      .insert(zkProofs)
      .values(insertZkProof)
      .returning();
    return zkProof;
  }

  async getZkProofsByGiftCard(giftCardId: string): Promise<ZkProof[]> {
    return await db.select().from(zkProofs)
      .where(eq(zkProofs.giftCardId, giftCardId))
      .orderBy(desc(zkProofs.createdAt));
  }
}

export const storage = new DatabaseStorage();
