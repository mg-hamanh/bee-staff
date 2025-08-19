import { BonusReport } from "@/types/type";
import sql from "./db";

export async function fetchBonusReport(params?: {
  user_id?: number;
  start_date?: string;
  end_date?: string;
}): Promise<BonusReport[]> {
  // param ngày, nếu không có thì dùng mặc định (nguyên query gốc đã DATE_TRUNC nên optional cũng ok)
  const startDate = params?.start_date ?? null;
  const endDate = params?.end_date ?? null;

  // filter user
  let userFilter = sql``;
  if (params?.user_id) {
    // invoices.sale_id là int, users.id là string → ép khi join
    userFilter = sql`AND sale_id = ${params.user_id}::int`;
  }

  const rows = await sql<BonusReport[]>`
    WITH
    -- Hóa đơn được lọc
    filtered_invoices AS (
      SELECT
        id,
        sale_id,
        date,
        type,
        money,
        mode,
        ROW_NUMBER() OVER (PARTITION BY id ORDER BY id) AS rn
      FROM invoices
      WHERE
        date BETWEEN DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') AND CURRENT_DATE
        AND mode IN (1,2) -- online + offline
        AND is_deleted = FALSE
        ${userFilter}
    ),

    -- Chi tiết hóa đơn
    filtered_invoice_details AS (
      SELECT
        idt.invoice_id,
        idt.quantity,
        idt.money,
        i.date,
        i.type,
        i.sale_id
      FROM invoice_details idt
      JOIN filtered_invoices i ON i.id = idt.invoice_id
      WHERE i.rn = 1
    ),

    -- Chỉ số kỳ hiện tại
    current_period_metrics AS (
      SELECT
        i.sale_id,
        u.full_name,
        COUNT(DISTINCT i.id) AS total_invoices,
        COUNT(DISTINCT CASE WHEN sub.total_qty >= 2 THEN i.id END) AS valid_invoices,
        SUM(CASE WHEN i.type = 2 THEN idt.quantity ELSE -idt.quantity END) AS total_products,
        SUM(CASE WHEN i.type = 2 THEN idt.money ELSE -idt.money END) AS total_revenues
      FROM filtered_invoices i
      JOIN filtered_invoice_details idt ON idt.invoice_id = i.id
      JOIN users u ON u.id = i.sale_id::varchar
      LEFT JOIN (
        SELECT
          invoice_id,
          SUM(CASE WHEN type = 2 THEN quantity ELSE -quantity END) AS total_qty
        FROM filtered_invoice_details
        WHERE date BETWEEN DATE_TRUNC('month', CURRENT_DATE) AND CURRENT_DATE
        GROUP BY invoice_id
      ) AS sub ON sub.invoice_id = i.id
      WHERE i.date BETWEEN DATE_TRUNC('month', CURRENT_DATE) AND CURRENT_DATE
        AND u.full_name NOT ILIKE '%bee%'
      GROUP BY i.sale_id, u.full_name
    ),

    -- Chỉ số kỳ trước
    last_period_metrics AS (
      SELECT
        i.sale_id,
        COUNT(DISTINCT i.id) AS total_invoices,
        COUNT(DISTINCT CASE WHEN sub.total_qty >= 2 THEN i.id END) AS valid_invoices,
        SUM(CASE WHEN i.type = 2 THEN idt.quantity ELSE -idt.quantity END) AS total_products,
        SUM(CASE WHEN i.type = 2 THEN idt.money ELSE -idt.money END) AS total_revenues
      FROM filtered_invoices i
      JOIN filtered_invoice_details idt ON idt.invoice_id = i.id
      LEFT JOIN (
        SELECT
          invoice_id,
          SUM(CASE WHEN type = 2 THEN quantity ELSE -quantity END) AS total_qty
        FROM filtered_invoice_details
        WHERE date BETWEEN DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') 
                      AND (CURRENT_DATE - INTERVAL '1 month')
        GROUP BY invoice_id
      ) AS sub ON sub.invoice_id = i.id
      WHERE i.date BETWEEN DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month') 
                       AND (CURRENT_DATE - INTERVAL '1 month')
      GROUP BY i.sale_id
    ),

    -- Mapping user với template
    user_targets AS (
      SELECT
        u.id AS user_id,
        pl.level,
        pl.amount,
        pl.bonus
      FROM users u
      JOIN pay_rate_templates pt ON pt.id = u.pay_rate_id
      JOIN pay_rate_levels pl ON pl.template_id = pt.id
      WHERE pt.status = 1
    )

    -- Kết quả cuối cùng
    SELECT
      cpm.sale_id,
      cpm.full_name,
      COALESCE(cpm.total_invoices, 0) AS current_total_invoices,
      COALESCE(lpm.total_invoices, 0) AS last_total_invoices,
      COALESCE(cpm.valid_invoices, 0) AS current_valid_invoices,
      COALESCE(lpm.valid_invoices, 0) AS last_valid_invoices,
      COALESCE(cpm.total_products, 0) AS current_total_products,
      COALESCE(lpm.total_products, 0) AS last_total_products,
      COALESCE(cpm.total_revenues, 0) AS current_total_revenues,
      COALESCE(lpm.total_revenues, 0) AS last_total_revenues,

      -- Growth %
      ROUND(100.0 * (COALESCE(cpm.total_invoices, 0) - COALESCE(lpm.total_invoices, 0)) 
        / NULLIF(COALESCE(lpm.total_invoices, 0), 0), 2) AS growth_invoices_percent,
      ROUND(100.0 * (COALESCE(cpm.valid_invoices, 0) - COALESCE(lpm.valid_invoices, 0)) 
        / NULLIF(COALESCE(lpm.valid_invoices, 0), 0), 2) AS growth_valid_invoices_percent,
      ROUND(100.0 * (COALESCE(cpm.total_products, 0) - COALESCE(lpm.total_products, 0)) 
        / NULLIF(COALESCE(lpm.total_products, 0), 0), 2) AS growth_products_percent,
      ROUND(100.0 * (COALESCE(cpm.total_revenues, 0) - COALESCE(lpm.total_revenues, 0)) 
        / NULLIF(COALESCE(lpm.total_revenues, 0), 0), 2) AS growth_revenues_percent,

      -- Target hiện tại & kế tiếp
      MIN(ut.amount) AS min_target_amount,
      ROUND(100.0 * COALESCE(cpm.total_revenues, 0)
        / NULLIF(COALESCE(MIN(ut.amount), 0), 0), 2) AS target_percent,
      MAX(CASE WHEN cpm.total_revenues >= ut.amount THEN ut.amount END) AS current_target_amount,
      CEILING(
        MAX(CASE WHEN cpm.total_revenues >= ut.amount THEN ut.bonus END) * cpm.total_revenues / 100
      ) AS current_bonus,
      MIN(CASE WHEN cpm.total_revenues < ut.amount THEN ut.amount END) - cpm.total_revenues AS next_target_amount,
      CEILING(
        MIN(CASE WHEN cpm.total_revenues < ut.amount THEN ut.amount END)
        * MIN(CASE WHEN cpm.total_revenues < ut.amount THEN ut.bonus END) / 100
      ) AS next_bonus

    FROM current_period_metrics cpm
    LEFT JOIN last_period_metrics lpm ON cpm.sale_id = lpm.sale_id
    LEFT JOIN user_targets ut ON ut.user_id = cpm.sale_id::varchar
    GROUP BY
      cpm.sale_id,
      cpm.full_name,
      cpm.total_invoices,
      cpm.valid_invoices,
      cpm.total_products,
      cpm.total_revenues,
      lpm.total_invoices,
      lpm.valid_invoices,
      lpm.total_products,
      lpm.total_revenues;
  `;

  return rows;
}
