"use client"

import type React from "react"

import { useEffect, useState, Suspense } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Users, Package, ClipboardList, LogOut, Menu, X, Home, FileText, Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("isAuthenticated")
    if (auth !== "true") {
      router.push("/")
    } else {
      setIsAuthenticated(true)
    }

    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    router.push("/")
  }

  const goToDocs = () => {
    router.push("/dashboard/docs")
  }
  

  if (!isAuthenticated) {
    return null
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Clientes", href: "/dashboard/clients", icon: Users },
    { name: "Productos", href: "/dashboard/products", icon: Package },
    { name: "Pedidos", href: "/dashboard/orders", icon: ClipboardList },
    { name: "Documentación", href: "/dashboard/docs", icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-4 border-b border-slate-200">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">AdminSys</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-700",
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-200">
            <Button
              variant="outline"
              className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5 text-slate-500" aria-hidden="true" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn("transition-all duration-300 ease-in-out", isSidebarOpen ? "lg:pl-64" : "lg:pl-0")}>
        {/* Top navigation */}
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          

          <div className="flex-1 flex justify-between items-center">
            <div className="relative max-w-md w-full hidden md:block">
              
            </div>

            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700">
                      <Bell className="h-5 w-5" />
                      <span className="sr-only">Notificaciones</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notificaciones</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 border border-slate-200">
                      <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={goToDocs}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Documentación</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && isMobile && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}
