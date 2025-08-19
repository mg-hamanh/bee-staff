"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Users,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUp,
  ArrowDown,
  Settings2,
  Calendar,
  Download,
} from "lucide-react"

interface BonusData {
  sale_id: number
  full_name: string
  current_total_invoices: string
  last_total_invoices: string
  current_valid_invoices: string
  last_valid_invoices: string
  current_total_products: string
  last_total_products: string
  current_total_revenues: string
  last_total_revenues: string
  growth_invoices_percent: string
  growth_valid_invoices_percent: string
  growth_products_percent: string
  growth_revenues_percent: string
  current_target_amount: string | null
  current_bonus: string | null
  next_target_amount: string
  next_bonus: string
  min_target_amount: string | null
  target_percent: string | null
}

export function AdminDashboard() {
  const [data, setData] = useState<BonusData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof BonusData; direction: "asc" | "desc" } | null>(null)
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    sale_id: true,
    invoices: true,
    valid_invoices: true,
    products: true,
    revenue: true,
    current_bonus: true,
    next_target: true,
    min_target: true,
    target_percent: true,
  })
  const [selectedPeriod, setSelectedPeriod] = useState("Tuần này")
  const itemsPerPage = 25

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://n8n.beeshoes.com.vn/webhook/bonus-by-user")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const result = await response.json()
        setData(Array.isArray(result) ? result : [result])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number.parseInt(value))
  }

  const formatPercent = (value: string) => {
    if (!value || value === "null" || value === "undefined") return "-"
    const num = Number.parseFloat(value)
    if (isNaN(num)) return "-"
    return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`
  }

  const getGrowthColor = (value: string) => {
    if (!value || value === "null" || value === "undefined") return "text-gray-400"
    const num = Number.parseFloat(value)
    if (isNaN(num)) return "text-gray-400"
    if (num > 0) return "text-green-600"
    if (num < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getGrowthIcon = (value: string) => {
    if (!value || value === "null" || value === "undefined") return null
    const num = Number.parseFloat(value)
    if (isNaN(num)) return null
    if (num > 0) return <TrendingUp className="h-4 w-4" />
    if (num < 0) return <TrendingDown className="h-4 w-4" />
    return null
  }

  const getTargetPercentColor = (value: string) => {
    if (!value || value === "null" || value === "undefined") return "text-gray-400"
    const num = Number.parseFloat(value)
    if (isNaN(num)) return "text-gray-400"
    if (num >= 80) return "text-green-600"
    if (num >= 60) return "text-blue-600"
    if (num >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || user.sale_id.toString().includes(searchTerm),
    )

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (typeof aValue === "string" && typeof bValue === "string") {
          const aNum = Number.parseFloat(aValue) || 0
          const bNum = Number.parseFloat(bValue) || 0
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum
          }
          return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }

        return 0
      })
    }

    return filtered
  }, [data, searchTerm, sortConfig])

  const totals = useMemo(() => {
    return filteredAndSortedData.reduce(
      (acc, user) => ({
        invoices: acc.invoices + Number.parseInt(user.current_total_invoices),
        valid_invoices: acc.valid_invoices + Number.parseInt(user.current_valid_invoices),
        products: acc.products + Number.parseInt(user.current_total_products),
        revenue: acc.revenue + Number.parseInt(user.current_total_revenues),
        bonus: acc.bonus + (user.current_bonus ? Number.parseInt(user.current_bonus) : 0),
      }),
      { invoices: 0, valid_invoices: 0, products: 0, revenue: 0, bonus: 0 },
    )
  }, [filteredAndSortedData])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredAndSortedData.slice(startIndex, endIndex)

  const handleSort = (key: keyof BonusData) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const getSortArrow = (columnKey: keyof BonusData) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-2 h-4 w-4" />
      )
    }
    return null
  }

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }))
  }

  const exportToExcel = () => {
    // Create CSV content
    const headers = [
      visibleColumns.name && "Name",
      visibleColumns.sale_id && "Sale ID",
      visibleColumns.invoices && "Invoices",
      visibleColumns.valid_invoices && "Valid Invoices",
      visibleColumns.products && "Products",
      visibleColumns.revenue && "Revenue",
      visibleColumns.current_bonus && "Current Bonus",
      visibleColumns.next_target && "Next Target",
      visibleColumns.min_target && "Min Target",
      visibleColumns.target_percent && "Target Percent",
    ]
      .filter(Boolean)
      .join(",")

    const csvContent = [
      headers,
      ...filteredAndSortedData.map((user) =>
        [
          visibleColumns.name && `"${user.full_name}"`,
          visibleColumns.sale_id && user.sale_id,
          visibleColumns.invoices && user.current_total_invoices,
          visibleColumns.valid_invoices && user.current_valid_invoices,
          visibleColumns.products && user.current_total_products,
          visibleColumns.revenue && user.current_total_revenues,
          visibleColumns.current_bonus && (user.current_bonus || "0"),
          visibleColumns.next_target && user.next_target_amount,
          visibleColumns.min_target && (user.min_target_amount || "0"),
          visibleColumns.target_percent && (user.target_percent || "0"),
        ]
          .filter(Boolean)
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `sales-report-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading admin dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      

      <Card>
        <CardHeader>
          
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {selectedPeriod}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Tuần này")}>Tuần này</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Tuần trước")}>Tuần trước</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Tháng này")}>Tháng này</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Tháng trước")}>Tháng trước</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPeriod("Tùy chọn")}>Tùy chọn</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem checked={visibleColumns.name} onCheckedChange={() => toggleColumn("name")}>
                    Name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.sale_id}
                    onCheckedChange={() => toggleColumn("sale_id")}
                  >
                    Sale ID
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.invoices}
                    onCheckedChange={() => toggleColumn("invoices")}
                  >
                    Invoices
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.valid_invoices}
                    onCheckedChange={() => toggleColumn("valid_invoices")}
                  >
                    Valid Invoices
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.products}
                    onCheckedChange={() => toggleColumn("products")}
                  >
                    Products
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.revenue}
                    onCheckedChange={() => toggleColumn("revenue")}
                  >
                    Revenue
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.current_bonus}
                    onCheckedChange={() => toggleColumn("current_bonus")}
                  >
                    Current Bonus
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.next_target}
                    onCheckedChange={() => toggleColumn("next_target")}
                  >
                    Next Target
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.min_target}
                    onCheckedChange={() => toggleColumn("min_target")}
                  >
                    Min Target
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={visibleColumns.target_percent}
                    onCheckedChange={() => toggleColumn("target_percent")}
                  >
                    Target %
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.name && (
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("full_name")}
                      className="h-auto p-0 font-semibold"
                    >
                      Name {getSortArrow("full_name")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.sale_id && (
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort("sale_id")} className="h-auto p-0 font-semibold">
                      Sale ID {getSortArrow("sale_id")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.invoices && (
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("current_total_invoices")}
                      className="h-auto p-0 font-semibold"
                    >
                      Invoices {getSortArrow("current_total_invoices")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.valid_invoices && (
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("current_valid_invoices")}
                      className="h-auto p-0 font-semibold"
                    >
                      Valid Invoices {getSortArrow("current_valid_invoices")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.products && (
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("current_total_products")}
                      className="h-auto p-0 font-semibold"
                    >
                      Products {getSortArrow("current_total_products")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.revenue && (
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("current_total_revenues")}
                      className="h-auto p-0 font-semibold"
                    >
                      Revenue {getSortArrow("current_total_revenues")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.current_bonus && (
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("current_bonus")}
                      className="h-auto p-0 font-semibold"
                    >
                      Current Bonus {getSortArrow("current_bonus")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.next_target && <TableHead className="text-right">Next Target</TableHead>}
                {visibleColumns.min_target && (
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("min_target_amount")}
                      className="h-auto p-0 font-semibold"
                    >
                      Min Target {getSortArrow("min_target_amount")}
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.target_percent && (
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("target_percent")}
                      className="h-auto p-0 font-semibold"
                    >
                      Target % {getSortArrow("target_percent")}
                    </Button>
                  </TableHead>
                )}
              </TableRow>
              <TableRow className="bg-muted/50 font-semibold">
                {visibleColumns.name && <TableCell>Total ({filteredAndSortedData.length} users)</TableCell>}
                {visibleColumns.sale_id && <TableCell>-</TableCell>}
                {visibleColumns.invoices && (
                  <TableCell className="text-right">{totals.invoices.toLocaleString()}</TableCell>
                )}
                {visibleColumns.valid_invoices && (
                  <TableCell className="text-right">{totals.valid_invoices.toLocaleString()}</TableCell>
                )}
                {visibleColumns.products && (
                  <TableCell className="text-right">{totals.products.toLocaleString()}</TableCell>
                )}
                {visibleColumns.revenue && (
                  <TableCell className="text-right">{formatCurrency(totals.revenue.toString())}</TableCell>
                )}
                {visibleColumns.current_bonus && (
                  <TableCell className="text-right">{formatCurrency(totals.bonus.toString())}</TableCell>
                )}
                {visibleColumns.next_target && <TableCell className="text-right">-</TableCell>}
                {visibleColumns.min_target && <TableCell className="text-right">-</TableCell>}
                {visibleColumns.target_percent && <TableCell className="text-right">-</TableCell>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((user) => (
                <TableRow key={user.sale_id}>
                  {visibleColumns.name && <TableCell className="font-medium">{user.full_name}</TableCell>}
                  {visibleColumns.sale_id && <TableCell>{user.sale_id}</TableCell>}
                  {visibleColumns.invoices && (
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">{user.current_total_invoices}</span>
                        {user.growth_invoices_percent && user.growth_invoices_percent !== "null" ? (
                          <div
                            className={`flex items-center gap-1 text-xs ${getGrowthColor(user.growth_invoices_percent)}`}
                          >
                            {getGrowthIcon(user.growth_invoices_percent)}
                            {formatPercent(user.growth_invoices_percent)}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.valid_invoices && (
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">{user.current_valid_invoices}</span>
                        {user.growth_valid_invoices_percent && user.growth_valid_invoices_percent !== "null" ? (
                          <div
                            className={`flex items-center gap-1 text-xs ${getGrowthColor(user.growth_valid_invoices_percent)}`}
                          >
                            {getGrowthIcon(user.growth_valid_invoices_percent)}
                            {formatPercent(user.growth_valid_invoices_percent)}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.products && (
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">{user.current_total_products}</span>
                        {user.growth_products_percent && user.growth_products_percent !== "null" ? (
                          <div
                            className={`flex items-center gap-1 text-xs ${getGrowthColor(user.growth_products_percent)}`}
                          >
                            {getGrowthIcon(user.growth_products_percent)}
                            {formatPercent(user.growth_products_percent)}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.revenue && (
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">{formatCurrency(user.current_total_revenues)}</span>
                        {user.growth_revenues_percent && user.growth_revenues_percent !== "null" ? (
                          <div
                            className={`flex items-center gap-1 text-xs ${getGrowthColor(user.growth_revenues_percent)}`}
                          >
                            {getGrowthIcon(user.growth_revenues_percent)}
                            {formatPercent(user.growth_revenues_percent)}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.current_bonus && (
                    <TableCell className="text-right">
                      {user.current_bonus ? (
                        <Badge variant="default">{formatCurrency(user.current_bonus)}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.next_target && (
                    <TableCell className="text-right">
                      {user.next_target_amount && user.next_target_amount !== "null" ? (
                        <div className="flex flex-col items-end text-sm">
                          <span>{formatCurrency(user.next_target_amount)}</span>
                          <span className="text-green-600 text-xs">{formatCurrency(user.next_bonus)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.min_target && (
                    <TableCell className="text-right">
                      {user.min_target_amount ? (
                        <span className="font-semibold">{formatCurrency(user.min_target_amount)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.target_percent && (
                    <TableCell className="text-right">
                      {user.target_percent && user.target_percent !== "null" ? (
                        <Badge
                          variant="outline"
                          className={`font-semibold ${getTargetPercentColor(user.target_percent)}`}
                        >
                          {formatPercent(user.target_percent)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedData.length)} of{" "}
                {filteredAndSortedData.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-muted-foreground">...</span>
                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
