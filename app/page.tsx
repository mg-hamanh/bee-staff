"use client"

import type React from "react"

import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AdminDashboard } from "@/components/admin-dashboard"
import { UserDashboard } from "@/components/user-dashboard"
import AdminSettings from "@/components/admin-settings"
import { BarChart3, Users, User, Settings } from "lucide-react"

type UserRole = "admin" | "user"
type ViewType = "admin" | "user" | "settings"

interface AppUser {
  username: string
  role: UserRole
  userId?: string
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<AppUser | null>(null)
  const [currentView, setCurrentView] = useState<ViewType>("admin")
  const [username, setUsername] = useState("")
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState<UserRole>("user")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      setUser({
        username,
        role,
        userId: role === "user" ? userId : undefined,
      })
      setIsLoggedIn(true)
      setCurrentView(role === "admin" ? "admin" : "user")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setUsername("")
    setUserId("")
    setRole("user")
    setCurrentView("admin")
  }

  const handleGoogleLogin = () => {
    // Simulate Google OAuth login - replace with actual Google OAuth implementation
    const mockUser = {
      username: "Google User",
      role: "admin" as UserRole, // Default to admin, can be determined from Google profile
      userId: "google-user-123",
    }
    setUser(mockUser)
    setIsLoggedIn(true)
    setCurrentView(mockUser.role === "admin" ? "admin" : "user")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-2">
              <BarChart3 className="h-6 w-6" />
              <span className="font-semibold">Bonus Tracker</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {isLoggedIn && user ? (
                user.role === "admin" ? (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={currentView === "admin"} onClick={() => setCurrentView("admin")}>
                        <Users className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive={currentView === "user"} onClick={() => setCurrentView("user")}>
                        <User className="h-4 w-4" />
                        <span>User View</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={currentView === "settings"}
                        onClick={() => setCurrentView("settings")}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={true}>
                      <User className="h-4 w-4" />
                      <span>My Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ) : (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleGoogleLogin}>
                    <User className="h-4 w-4" />
                    <span>Login with Google</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>

          {isLoggedIn && user && (
            <SidebarFooter className="border-t">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout}>
                    <User className="h-4 w-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <div className="px-2 py-2 text-xs text-muted-foreground">
                {user.username} ({user.role})
              </div>
            </SidebarFooter>
          )}
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">
                {isLoggedIn && user
                  ? user.role === "admin"
                    ? currentView === "admin"
                      ? "Admin Dashboard"
                      : currentView === "settings"
                        ? "Settings"
                        : "User View"
                    : "My Dashboard"
                  : "Welcome - Please Login"}
              </h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            {isLoggedIn && user ? (
              user.role === "admin" ? (
                currentView === "admin" ? (
                  <AdminDashboard />
                ) : currentView === "settings" ? (
                  <AdminSettings />
                ) : (
                  <UserDashboard userId="demo-user" />
                )
              ) : (
                <UserDashboard userId={user.userId!} />
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2">Welcome to Bonus Tracker</h2>
                  <p className="text-muted-foreground">
                    Please click "Login with Google" in the sidebar to access your dashboard.
                  </p>
                </div>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
