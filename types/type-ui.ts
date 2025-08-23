export type UserRole = "seller" | "cashier" | "leader";
export type SessionStatus = "active" | "expired";


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

export interface BonusLevelUI  {
  clientId?: string;
  id?: string;
  amount: number;
  unit: "PERCENT" | "VND";
  bonus: number;
};

export interface BonusTemplateUI  {
  clientId?: string;
  id?: string;
  templateId?: string;
  status: boolean;
  type: number;
  mode: number;
  description?: string;
  bonusLevels: BonusLevelUI[]; 
};

export interface  PayRateTemplateUI  {
  id: string;
  name: string;
  bonusTemplates?: BonusTemplateUI[];
  users?: UserUI[];
  totalUser: number;
};

export type UsersResponse = {
  users: UserUI[];
  total: number;
  page: number;
  totalPages: number;
};

export interface UserUI {
  id: string;
  username?: string;
  email?: string;
  mobile?: string;
  name: string;
  image?: string;
  role: string;             // có thể thay bằng UserRole nếu dùng type alias
  emailVerified: boolean;
  type: string;
  createdAt?: Date;
  updateAt?: Date;
  isAdmin: boolean;
  isActive: boolean;
  payRateId?: string;
  payRate?: PayRateTemplateUI;
  accounts: AccountUI[];
  sessions: SessionUI[];
}

export interface SessionUI {
  id: string;
  userId: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface AccountUI {
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  idToken?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}