export type UserRole = "seller" | "cashier" | "leader";
export type SessionStatus = "active" | "expired";
export type UserTabValue = "info" | "payRate";


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
  email: string;
  mobile?: string;
  name: string;
  image?: string;
  depots?: number[] | null
  role: UserRole;             // có thể thay bằng UserRole nếu dùng type alias
  emailVerified: boolean;
  type: string;
  createdAt?: Date;
  updateAt?: Date;
  isAdmin: boolean;
  isActive: boolean;
  payRateId?: string;
  payRateTemplate?: PayRateTemplateUI;
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

export interface DepotUI {
  id: number;
  code?: string | null;
  name?: string | null;
  mobile?: string | null;
  cityId?: number | null;
  districtId?: number | null;
  wardId?: number | null;
  address?: string | null;
}

export interface PaysheetUI {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  periodId: number;
  periodName: string;
  status: number;
  employeeTotal: number;
  totalNetSalary: number;
  totalBonus: number;
  totalPayment: number;
  totalNeedPay: number;
  payslips: PayslipUI[];
  note?: string;
  createdById: string;
  createdDate: Date;
  modifiedById: string;
  modifiedDate: Date;
}

export interface PaysheetTotalRow {
  totalNetSalary: number;
  totalPayment: number;
  totalNeedPay: number;
  totalRefund: number;
  [key: string]: number; 
}

export interface workingPeriodUI {
        id: number;
        name: string;
        startTime: Date;
        endTime: Date;
}

export interface PayslipUI {
  id: string;
  code: string; // Mã phiếu lương duy nhất (ví dụ: "PL000007")
  paysheetId: string; // Khóa ngoại đến bảng Paysheet
  employeeId: string; // Khóa ngoại đến bảng Employee
  status: number; // Trạng thái phiếu lương (ví dụ: 1: Đã tính)
  mainSalary: number; // Lương chính
  commissionSalary: number; // Lương hoa hồng
  overtimeSalary: number; // Lương làm thêm giờ
  allowance: number; // Tổng các khoản phụ cấp
  deduction: number; // Tổng các khoản khấu trừ
  bonus: number; // Tổng các khoản thưởng
  netSalary: number; // Lương thực nhận
  grossSalary: number; // Lương gộp
  totalPayment: number; // Số tiền đã thanh toán
  totalNeedPay: number; // Số tiền còn phải trả
  createdDate: Date; // Ngày tạo phiếu lương

  // Dữ liệu JSON cho các quy tắc tính lương phức tạp
  bonusSalaryRuleParam?: any; // Tham số tính thưởng (có thể dùng Record<string, any> nếu cần rõ hơn)
  allowanceRuleParam?: any; // Tham số tính phụ cấp
  deductionRuleParam?: any; // Tham số tính khấu trừ

  // Quan hệ
  paysheet: PaysheetUI;
  employee: UserUI;


}

export type SettingValues = {
  [key: string]: string | number | boolean | object | null;
};