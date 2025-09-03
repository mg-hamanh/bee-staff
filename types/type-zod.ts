import { z } from "zod";

export const UnitEnum = z.enum(["PERCENT", "VND"])
export const RoleEnum = z.enum(["seller","cashier","leader"])
export const PaysheetScopeEnum = z.enum(["all","optional"])

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


export const UserSchema = z.
object({
  username: z.string().max(100).nullable().optional(),
  name: z
    .string()
    .min(1,{ message: "Tên nhân viên không được để trống"})
    .max(50, { message: "Tên nhân viên không được dài quá 255 ký tự" }),
  email: z.email({ message: "Vui lòng nhập email nhân viên"}).max(255),
  mobile: z.string().max(10, { message: "Số điện thoại không hợp lệ" }).nullable().optional(),
  depots: z.array(z.number().int()).nullable().optional(),
  image: z.url().nullable().optional(),
  role: RoleEnum,
  isActive: z.boolean().default(true),
  payRateId: z.string().nullable().optional(),
  
});

export const CreateUserSchema = UserSchema
.refine(
  async (data) => {
    if (!data.email) return true;

    try {
      const response = await fetch(
        `/api/users/check-email?email=${encodeURIComponent(data.email)}`
      );
      const result = await response.json();

      return !result.exists;
    } catch (error) {
      console.error("API check email error:", error);
      return true;
    }
  },
  {
    message: "Email này đã được sử dụng",
    path: ["email"],
  }
);

export const UpdateUserSchema = UserSchema.extend({
  id: z.uuid(),
});

export const createPaysheetSchema = z.object({
  periodId: z.string(),
  periodName: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  scope: PaysheetScopeEnum,
  employeeIds: z.array(z.string()),
}).refine(data => {
  // Nếu scope là 'optional', thì mảng employeeIds không được rỗng
  if (data.scope === 'optional' && data.employeeIds.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Vui lòng chọn ít nhất một nhân viên khi phạm vi là 'Tùy chọn'",
  path: ["employeeIds"], // Gán lỗi cho trường employeeIds
});


// Type inference
export type BonusLevel = z.infer<typeof BonusLevelSchema>;
export type BonusTemplate = z.infer<typeof BonusTemplateSchema>;
export type PayRateTemplate = z.infer<typeof PayRateTemplateSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type CreatePaysheet = z.infer<typeof createPaysheetSchema>;