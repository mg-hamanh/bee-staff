import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import GrowthCell from "./GrowthCell";
import { TargetCell } from "./TargetCell";
import { BonusReport } from "@/types/type";
import { VisibleColumns } from "./hooks/useBonusReport";
import { formatCurrency } from "@/utils/formatters";

interface DashboardTableProps {
  data: BonusReport[];
  visibleColumns: VisibleColumns;
}

export function DashboardTable({ data, visibleColumns }: DashboardTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {visibleColumns.name && <TableHead>Name</TableHead>}
          {visibleColumns.sale_id && <TableHead>Sale ID</TableHead>}
          {visibleColumns.invoices && (
            <TableHead className="text-right">Invoices</TableHead>
          )}
          {visibleColumns.valid_invoices && (
            <TableHead className="text-right">Valid Invoices</TableHead>
          )}
          {visibleColumns.products && (
            <TableHead className="text-right">Products</TableHead>
          )}
          {visibleColumns.revenue && (
            <TableHead className="text-right">Revenue</TableHead>
          )}
          {visibleColumns.current_bonus && (
            <TableHead className="text-right">Current Bonus</TableHead>
          )}
          {visibleColumns.next_target && (
            <TableHead className="text-right">Next Target</TableHead>
          )}
          {visibleColumns.min_target && (
            <TableHead className="text-right">Min Target</TableHead>
          )}
          {visibleColumns.target_percent && (
            <TableHead className="text-right">Target %</TableHead>
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((user) => (
          <TableRow key={user.sale_id}>
            {visibleColumns.name && <TableCell>{user.full_name}</TableCell>}
            {visibleColumns.sale_id && <TableCell>{user.sale_id}</TableCell>}
            {visibleColumns.invoices && (
              <TableCell className="text-right">
                <span className="font-semibold">
                  {user.current_total_invoices}
                </span>
                <GrowthCell value={user.growth_invoices_percent} />
              </TableCell>
            )}
            {visibleColumns.valid_invoices && (
              <TableCell className="text-right">
                <span className="font-semibold">
                  {user.current_valid_invoices}
                </span>
                <GrowthCell value={user.growth_valid_invoices_percent} />
              </TableCell>
            )}
            {visibleColumns.products && (
              <TableCell className="text-right">
                <span className="font-semibold">
                  {user.current_total_products}
                </span>
                <GrowthCell value={user.growth_products_percent} />
              </TableCell>
            )}
            {visibleColumns.revenue && (
              <TableCell className="text-right">
                <span className="font-semibold">
                  {formatCurrency(user.current_total_revenues)}
                </span>
                <GrowthCell value={user.growth_revenues_percent} />
              </TableCell>
            )}
            {visibleColumns.current_bonus && (
              <TableCell className="text-right">
                {user.current_bonus ? (
                  <Badge>{formatCurrency(user.current_bonus)}</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            )}
            {visibleColumns.next_target && (
              <TableCell className="text-right">
                {user.next_target_amount ? (
                  <div className="flex flex-col items-end text-sm">
                    <span>{formatCurrency(user.next_target_amount)}</span>
                    <span className="text-green-600 text-xs">
                      {formatCurrency(user.next_bonus ?? "0")}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            )}
            {visibleColumns.min_target && (
              <TableCell className="text-right">
                {user.min_target_amount ? (
                  <span className="font-semibold">
                    {formatCurrency(user.min_target_amount)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            )}
            {visibleColumns.target_percent && (
              <TableCell className="text-right">
                <TargetCell percent={user.target_percent} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
