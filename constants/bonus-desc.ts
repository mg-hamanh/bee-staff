import { PayRateTemplateUI } from "@/types/type-ui";
import { PayRateTemplate } from "@/types/type-zod";

export const BONUS_DESCRIPTIONS: Array<{
  mode: number;
  type: number;
  description: string; // để lưu DB, dùng string HTML hoặc plain text
}> = [
  {
    mode: 1,
    type: 1,
    description: `
<p>
  Thưởng được tính theo doanh thu thuần về bán hàng của nhân viên nằm trong mức thiết lập nào.<br />
  Ví dụ:<br />
  - Từ 0 đến 200,000 =&gt; 3%<br />
  - Từ 200,000 đến 500,000 =&gt; 5%<br />
  - Trên 500,000 =&gt; 10%<br />
  Giả sử tổng doanh thu thuần về bán hàng của nhân viên là 700,000, thì tiền thưởng nhân viên nhận được là:<br />
  700,000 * 10 % = 70,000
</p>
    `,
  },
  {
    mode: 1,
    type: 2,
    description: "<p>Mô tả cho mode=1, type=2</p>",
  },
  {
    mode: 2,
    type: 1,
    description: "<p>Mô tả cho mode=2, type=1</p>",
  },
];


export const emptyTemplate: PayRateTemplateUI = {
  id: Date.now().toString(),
  name: "",
  totalUser: 0,
  users: [],
  bonusTemplates: [
    {
      clientId: Date.now().toString(),
      type: 1,
      mode: 1,
      status: false,
      description: "",
      bonusLevels: [],
    },
  ],
};