"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ChartPie, DollarSign } from "lucide-react";
import { BonusReport } from "@/types/type-ui";
import { useSession } from "@/context/SessionContext";
import { formatCurrency, formatPercent, Period } from "@/utils/formatters";
import SemiCircleChart from "./bee-ui/SemiCircleChart";

export function UserDashboard() {
  const [data, setData] = useState<BonusReport | null>(null);
  const [period, setPeriod] = useState<Period>("week");
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const { session } = useSession();

  useEffect(() => {
    if (!session) return; // đợi có session mới fetch

    const fetchData = async () => {
      try {
        const response = await fetch("/api/bonus-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.session?.userId, // hoặc session.user?.id
            period,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const result = await response.json();
        setData(result[0]);
      } catch (err) {
        // setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, [session, period]);

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data found for user ID: </p>
      </div>
    );
  }

  const growth = data.growthRevenuesPercent ?? 0;
  const isPositive = growth > 0;

  console.log(isPositive);

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/5 text-primary p-1 rounded-lg">
                    <DollarSign className=" text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold">Doanh thu</h3>
                  <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">
                    Featured
                  </Badge>
                </div>

                <div className="inline-flex rounded-lg border border-gray-300 bg-white">
                  {/* Tuần */}
                  <Button
                    onClick={() => setPeriod("week")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      period === "week"
                        ? "bg-blue-500 text-white"
                        : "bg-transparent text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Tuần
                  </Button>

                  {/* Tháng */}
                  <Button
                    onClick={() => setPeriod("month")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      period === "month"
                        ? "bg-blue-500 text-white"
                        : "bg-transparent text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Tháng
                  </Button>
                </div>
              </div>

              <div className="text-4xl font-bold text-gray-900 mt-4 mb-2">
                {formatCurrency(data.currentTotalRevenues)}
              </div>
              <div className="flex items-center gap-2">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatPercent(growth)} so với{" "}
                  {period === "week" ? "tuần" : "tháng"} trước
                </span>
              </div>
              <div className="text-4xl font-bold text-green-600 mt-4 mb-2">
                +{formatCurrency(data.currentBonus ?? 0)}
              </div>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader className="">
              <div className="flex items-center gap-2">
                <div className="bg-primary/5 text-primary p-1 rounded-lg">
                  <ChartPie className=" text-2xl" />
                </div>

                <h3 className="font-semibold">Mục tiêu</h3>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
              <SemiCircleChart
                minTargetAmount={data.minTargetAmount}
                targetPercent={data.targetPercent}
              />
              <div className="w-full p-2 flex flex-row items-end justify-between rounded-lg bg-primary/5">
                <div className="flex flex-col">
                  <span className="text-xs">Hiện tại</span>
                  <h3 className="font-bold text-xl">
                    {formatCurrency(data.currentTargetAmount ?? 0)}
                  </h3>
                </div>
                <span className="font-bold text-md text-green-600">
                  +{formatCurrency(data.currentBonus ?? 0)}
                </span>
              </div>
              <div className="w-full p-2 flex flex-row items-end justify-between rounded-lg bg-primary/5">
                <div className="flex flex-col">
                  <span className="text-xs">Cần thêm</span>
                  <h3 className="font-bold text-xl">
                    {formatCurrency(data.nextTargetAmount ?? 0)}
                  </h3>
                </div>
                <span className="font-bold text-md text-gray-600">
                  {formatCurrency(data.nextBonus ?? 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
