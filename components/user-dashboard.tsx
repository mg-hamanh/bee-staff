"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, TrendingDown, Calendar, Users, CheckCircle2, Clock, ArrowUpRight } from "lucide-react"

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

interface UserDashboardProps {
  userId: string
}

export function UserDashboard({ userId }: UserDashboardProps) {
  const [data, setData] = useState<BonusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://n8n.beeshoes.com.vn/webhook/bonus-by-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number.parseInt(value))
  }

  const formatPercent = (value: string) => {
    const num = Number.parseFloat(value)
    return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`
  }

  const getGrowthColor = (value: string) => {
    const num = Number.parseFloat(value)
    if (num > 0) return "text-green-600"
    if (num < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getGrowthIcon = (value: string) => {
    const num = Number.parseFloat(value)
    if (num > 0) return <TrendingUp className="h-4 w-4" />
    if (num < 0) return <TrendingDown className="h-4 w-4" />
    return null
  }

  const calculateProgress = () => {
    if (!data || !data.next_target_amount || !data.current_total_revenues) return 0
    const current = Number.parseInt(data.current_total_revenues)
    const target = Number.parseInt(data.next_target_amount)
    return Math.min((current / target) * 100, 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading your dashboard...</span>
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

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No data found for user ID: {userId}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback className="bg-purple-100 text-purple-600 font-semibold">
              {data.full_name
                ? data.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good Evening Team</h1>
            <p className="text-gray-600">Have an in-depth look at all the metrics dashboard.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Users className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">Revenue Progress</h3>
                    <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100">Featured</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-green-600 font-medium">
                      {formatPercent(data.growth_revenues_percent)}
                    </span>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  Today <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="mt-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatCurrency(data.current_total_revenues).replace("₫", "$").replace(",", ",")}
                </div>
                <p className="text-sm text-gray-600">You're in the top 5% of all sales</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between h-32 mb-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-gray-200 rounded-t" style={{ height: "40%" }}></div>
                  <span className="text-xs text-gray-500">Apr</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-gray-200 rounded-t" style={{ height: "60%" }}></div>
                  <span className="text-xs text-gray-500">May</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-purple-500 rounded-t" style={{ height: "85%" }}></div>
                  <span className="text-xs text-gray-900 font-medium">Jun</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 bg-gray-200 rounded-t" style={{ height: "45%" }}></div>
                  <span className="text-xs text-gray-500">Jul</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Business</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                  <span>Design System</span>
                </div>
                <span className="ml-auto font-semibold">10+</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Share Progress</h3>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${calculateProgress() * 2.51} 251`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{Math.round(calculateProgress())}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">Complete</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">{data.current_total_invoices}</div>
                <p className="text-sm text-gray-600">Project Completed</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-sm text-green-600">
                  <span>1.2%</span>
                  <TrendingUp className="h-3 w-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Reminders</h3>
              <Button variant="ghost" size="sm" className="text-gray-500">
                See all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">78% On progress Task JJK</span>
              <CheckCircle2 className="h-4 w-4 text-purple-500 ml-auto" />
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Create a treatment plan</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Task Completed</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Today Task</h3>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">A</AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">B</AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">C</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {data.current_valid_invoices}/<span className="text-gray-400">30</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Finished tasked</span>
                <Button variant="ghost" size="sm" className="text-purple-600 p-0 h-auto">
                  View all
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {data.current_bonus && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Current Bonus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(data.current_bonus)}</div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.min_target_amount && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Minimum Target
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.min_target_amount)}</div>
              <p className="text-sm text-blue-600 mt-1">Required minimum achievement</p>
            </CardContent>
          </Card>
        )}

        {data.target_percent && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Target Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{formatPercent(data.target_percent)}</div>
              <p className="text-sm text-purple-600 mt-1">Current target completion</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
