import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default('user'), // user, merchant, admin
  walletAddress: text("wallet_address"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const giftCards = pgTable("gift_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: text("token_id").notNull().unique(),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  recipientEmail: text("recipient_email").notNull(),
  title: text("title").notNull(),
  message: text("message"),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull(),
  originalBalance: decimal("original_balance", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull().default('general'),
  status: text("status").notNull().default('active'), // active, redeemed, expired, partially_used
  tbaAddress: text("tba_address"),
  qrCode: text("qr_code"),
  expiresAt: timestamp("expires_at").notNull(),
  redeemedAt: timestamp("redeemed_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const merchants = pgTable("merchants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  businessName: text("business_name").notNull(),
  category: text("category").notNull(),
  posTerminalId: text("pos_terminal_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  giftCardId: varchar("gift_card_id").notNull().references(() => giftCards.id),
  merchantId: varchar("merchant_id").references(() => merchants.id),
  type: text("type").notNull(), // creation, redemption, reload, transfer
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  txHash: text("tx_hash"),
  zkProof: json("zk_proof"),
  status: text("status").notNull().default('pending'), // pending, confirmed, failed
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const zkProofs = pgTable("zk_proofs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  giftCardId: varchar("gift_card_id").notNull().references(() => giftCards.id),
  proofData: json("proof_data").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  giftCards: many(giftCards),
  merchant: many(merchants),
}));

export const giftCardsRelations = relations(giftCards, ({ one, many }) => ({
  owner: one(users, {
    fields: [giftCards.ownerId],
    references: [users.id],
  }),
  transactions: many(transactions),
  zkProofs: many(zkProofs),
}));

export const merchantsRelations = relations(merchants, ({ one, many }) => ({
  user: one(users, {
    fields: [merchants.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  giftCard: one(giftCards, {
    fields: [transactions.giftCardId],
    references: [giftCards.id],
  }),
  merchant: one(merchants, {
    fields: [transactions.merchantId],
    references: [merchants.id],
  }),
}));

export const zkProofsRelations = relations(zkProofs, ({ one }) => ({
  giftCard: one(giftCards, {
    fields: [zkProofs.giftCardId],
    references: [giftCards.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGiftCardSchema = createInsertSchema(giftCards).omit({
  id: true,
  tokenId: true,
  tbaAddress: true,
  qrCode: true,
  createdAt: true,
  updatedAt: true,
  redeemedAt: true,
});

export const insertMerchantSchema = createInsertSchema(merchants).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertZkProofSchema = createInsertSchema(zkProofs).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type GiftCard = typeof giftCards.$inferSelect;
export type InsertGiftCard = z.infer<typeof insertGiftCardSchema>;

export type Merchant = typeof merchants.$inferSelect;
export type InsertMerchant = z.infer<typeof insertMerchantSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type ZkProof = typeof zkProofs.$inferSelect;
export type InsertZkProof = z.infer<typeof insertZkProofSchema>;
