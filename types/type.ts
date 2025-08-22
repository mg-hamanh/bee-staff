import { User } from "@/lib/zod/schema";

export interface BonusReport {
  saleId: string;
  name: string;

  currentTotalInvoices: number;
  lastTotalInvoices: number;

  currentValidInvoices: number;
  lastValidInvoices: number;

  currentTotalProducts: number;
  lastTotalProducts: number;

  currentTotalRevenues: number;
  lastTotalRevenues: number;

  growthInvoicesPercent: number | null;
  growthValidInvoicesPercent: number | null;
  growthProductsPercent: number | null;
  growthRevenuesPercent: number | null;

  minTargetAmount: number;
  targetPercent: number | null;

  currentTargetAmount: number | null;
  currentBonus: number | null;

  nextTargetAmount: number | null;
  nextBonus: number | null;
}

export type BonusLevelUI = {
  clientId?: string;
  id?: string;
  amount: number;
  unit: "PERCENT" | "VND";
  bonus: number;
};

export type BonusTemplateUI = {
  clientId?: string;
  id?: string;
  status: boolean;
  type: number;
  mode: number;
  description?: string;
  bonusLevels: BonusLevelUI[]; 
};

export type PayRateTemplateUI =  {
  id?: string;
  name: string;
  bonusTemplates?: BonusTemplateUI[];
  users: User[];
  totalUser: number;
};

export type UsersResponse = {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
};