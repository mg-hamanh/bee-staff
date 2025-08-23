import { z } from "zod";

export const UnitEnum = z.enum(["PERCENT", "VND"])
export const RoleEnum = z.enum(["seller","cashier","leader"])
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
});


export const UserSchema = z.object({
  id: z.uuid(),
  username: z.string().max(100).nullable().optional(),
  name: z.string().max(255).nullable().optional(),
  email: z.email().max(255).nullable().optional(),
  mobile: z.string().max(15).nullable().optional(),
  depots: z.array(z.number().int()),
  image: z.url().nullable().optional(),
  role: RoleEnum,
  type: z.string().nullable().optional(),
  isAdmin: z.boolean().default(false),
  isActive: z.boolean().default(true),
  payRateId: z.string().nullable().optional(),
  
});

// Type inference
export type BonusLevel = z.infer<typeof BonusLevelSchema>;
export type BonusTemplate = z.infer<typeof BonusTemplateSchema>;
export type PayRateTemplate = z.infer<typeof PayRateTemplateSchema>;
export type User = z.infer<typeof UserSchema>;