export interface BonusReport {
  sale_id: number;
  full_name: string;

  current_total_invoices: number;
  last_total_invoices: number;

  current_valid_invoices: number;
  last_valid_invoices: number;

  current_total_products: number;
  last_total_products: number;

  current_total_revenues: number;
  last_total_revenues: number;

  growth_invoices_percent: number;
  growth_valid_invoices_percent: number;
  growth_products_percent: number;
  growth_revenues_percent: number;

  min_target_amount: number;
  target_percent: number;

  current_target_amount: number | null; 
  current_bonus: number | null;

  next_target_amount: number;
  next_bonus: number;
}
