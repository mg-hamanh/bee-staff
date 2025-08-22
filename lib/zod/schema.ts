import { z } from "zod";

export const UnitEnum = z.enum(["PERCENT", "VND"])
// BonusLevel
export const BonusLevelSchema = z.object({
  id: z.uuid().optional(),   // Prisma sẽ tự generate nếu không truyền
  amount: z.number().int().default(0),
  unit: UnitEnum,
  bonus: z.preprocess((val) => Number(val), z.number().default(0)),
});

// BonusTemplate
export const BonusTemplateSchema = z.object({
  id: z.uuid().optional(),
  templateId: z.uuid().optional(), // auto khi nested create
  type: z.number().int(),
  mode: z.number().int(),
  description: z.string().nullable().optional(),
  status: z.boolean().default(false),
  bonusLevels: z.array(BonusLevelSchema).optional(),
});

// PayRateTemplate
export const PayRateTemplateSchema = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  bonusTemplates: z.array(BonusTemplateSchema).optional(),
  users: z.array(z.any()).optional(),
  totalUser: z.number().default(0)
});


export const UserSchema = z.object({
  id: z.string(),
  username: z.string().max(100).nullable().optional(),
  name: z.string().max(255).nullable().optional(),
  email: z.email().max(255).nullable().optional(),
  mobile: z.string().max(15).nullable().optional(),
  roleName: z.string().max(100).nullable().optional(),
  depots: z.array(z.number().int()),
  emailVerified: z.date().nullable().optional(),
  image: z.url().nullable().optional(),
  roleId: z.number().int(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  isAdmin: z.boolean().default(false),
  payRateId: z.string().nullable().optional(),
  // Quan hệ (Account[], Session[], PayRateTemplate?) 
  // -> Tùy nhu cầu có thể bỏ hoặc define riêng
  accounts: z.any().array().optional(),
  sessions: z.any().array().optional(),
  payRateTemplate: z.any().nullable().optional(),
  
});

// Type inference
export type BonusLevel = z.infer<typeof BonusLevelSchema>;
export type BonusTemplate = z.infer<typeof BonusTemplateSchema>;
export type PayRateTemplate = z.infer<typeof PayRateTemplateSchema>;
export type User = z.infer<typeof UserSchema>;