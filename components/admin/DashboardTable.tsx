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
import { BonusReport } from "@/types/type-ui";
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
          {visibleColumns.saleId && <TableHead>Sale ID</TableHead>}
          {visibleColumns.invoices && (
            <TableHead className="text-right">Invoices</TableHead>
          )}
          {visibleColumns.validInvoices && (
            <TableHead className="text-right">Valid Invoices</TableHead>
          )}
          {visibleColumns.products && (
            <TableHead className="text-right">Products</TableHead>
          )}
          {visibleColumns.revenue && (
            <TableHead className="text-right">Revenue</TableHead>
          )}
          {visibleColumns.currentBonus && (
            <TableHead className="text-right">Current Bonus</TableHead>
          )}
          {visibleColumns.nextTarget && (
            <TableHead className="text-right">Next Target</TableHead>
          )}
          {visibleColumns.minTarget && (
            <TableHead className="text-right">Min Target</TableHead>
          )}
          {visibleColumns.targetPercent && (
            <TableHead className="text-right">Target %</TableHead>
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((user) => (
          <TableRow key={user.saleId}>
            {visibleColumns.name && <TableCell>{user.name}</TableCell>}
            {visibleColumns.saleId && <TableCell>{user.saleId}</TableCell>}
            {visibleColumns.invoices && (
              <TableCell className="text-right">
                <span className="font-semibold">
                  {user.currentTotalInvoices}
                </span>
                <GrowthCell value={user.growthInvoicesPercent} />
              </TableCell>
            )}
            {visibleColumns.validInvoices && (
              <TableCell className="text-right">
                <span className="font-semibold">
                  {user.currentValidInvoices}
                </span>
                <GrowthCell value={user.growthValidInvoicesPercent} />
              </TableCell>
            )}
            {visibleColumns.products && (
              <TableCell className="text-right">
                <span className="font-semibold">
                  {user.currentTotalProducts}
                </span>
                <GrowthCell value={user.growthProductsPercent} />
              </TableCell>
            )}
            {visibleColumns.revenue && (
              <TableCell className="text-right">
                <span className="font-semibold">
                  {formatCurrency(user.currentTotalRevenues)}
                </span>
                <GrowthCell value={user.growthRevenuesPercent} />
              </TableCell>
            )}
            {visibleColumns.currentBonus && (
              <TableCell className="text-right">
                {user.currentBonus ? (
                  <Badge>{formatCurrency(user.currentBonus)}</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            )}
            {visibleColumns.nextTarget && (
              <TableCell className="text-right">
                {user.nextTargetAmount ? (
                  <div className="flex flex-col items-end text-sm">
                    <span>{formatCurrency(user.nextTargetAmount)}</span>
                    <span className="text-green-600 text-xs">
                      {formatCurrency(user.nextBonus ?? "0")}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            )}
            {visibleColumns.minTarget && (
              <TableCell className="text-right">
                {user.minTargetAmount ? (
                  <span className="font-semibold">
                    {formatCurrency(user.minTargetAmount)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            )}
            {visibleColumns.targetPercent && (
              <TableCell className="text-right">
                <TargetCell percent={user.targetPercent} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
