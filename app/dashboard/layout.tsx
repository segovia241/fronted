"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  Users,
  Package,
  ClipboardList,
  FileText,
  Menu,
  LogOut,
  Clock,
  AlertCircle,
  LayoutDashboard,
  Bell,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function InactivityTimerDisplay() {
  const [timeLeft, setTimeLeft] = useState(60)
  const [isActive, setIsActive] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const resetTimer = () => {
    // Reset the time left to full
    setTimeLeft(60)
    // Mark that we've just had activity
    setLastActivity(Date.now())
    // If we were showing a warning, hide it
    if (showWarning) {
      setShowWarning(false)
    }
    // If the timer was not active, activate it
    if (!isActive) {
      setIsActive(true)
    }
  }

  // Handle user activity
  useEffect(() => {
    const handleActivity = () => {
      resetTimer()
    }

    // Add event listeners for user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
    events.forEach((event) => {
      window.addEventListener(event, handleActivity)
    })

    // Start with the timer active
    setIsActive(true)

    return () => {
      // Clean up event listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Handle the countdown timer
  useEffect(() => {
    // Only run the timer when there's been no activity for some time
    timerRef.current = setInterval(() => {
      const now = Date.now()
      // Only start counting down after 5 seconds of inactivity
      if (now - lastActivity >= 5000) {
        setTimeLeft((prev) => {
          // If we're at 15 seconds, show the warning
          if (prev <= 16 && prev > 15) {
            setShowWarning(true)
          }

          // If we're at 0, perform logout
          if (prev <= 1) {
            handleLogout()
            return 0
          }

          return prev - 1
        })
      } else {
        // Reset to full when there's activity
        setTimeLeft(60)
      }
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [lastActivity])

  const handleStayLoggedIn = () => {
    resetTimer()
  }

  const handleLogout = () => {
    // Clear interval first to prevent any further updates
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Clear authentication data
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    localStorage.removeItem("userToken")
    localStorage.removeItem("userName")
    localStorage.removeItem("userRole")

    // Redirect to login page
    router.push("/")
  }

  // Calculate whether the timer is counting down or showing "Activo"
  const isCountingDown = Date.now() - lastActivity >= 5000

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8">
          <svg className="progress-ring" width="32" height="32">
            <circle
              className="text-muted stroke-current"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
              r="14"
              cx="16"
              cy="16"
            />
            {isCountingDown ? (
              <circle
                className={`stroke-current ${timeLeft < 10 ? "text-destructive" : "text-primary"}`}
                strokeWidth="3"
                strokeDasharray="87.96"
                strokeDashoffset={87.96 - (timeLeft / 60) * 87.96}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="14"
                cx="16"
                cy="16"
              />
            ) : (
              <circle
                className="text-green-500 stroke-current"
                strokeWidth="3"
                strokeDasharray="87.96"
                strokeDashoffset="0"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="14"
                cx="16"
                cy="16"
              />
            )}
          </svg>
          {isCountingDown ? (
            <Clock className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          ) : (
            <Bell className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500" />
          )}
        </div>
        <span
          className={`font-mono text-sm ${!isCountingDown ? "text-green-500 font-medium" : timeLeft < 10 ? "text-destructive font-bold" : ""}`}
        >
          {isCountingDown ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}` : "Activo"}
        </span>
      </div>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent className="glass-effect">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Sesión a punto de expirar
            </AlertDialogTitle>
            <AlertDialogDescription>
              Su sesión expirará en {timeLeft} segundos debido a inactividad. ¿Desea continuar conectado?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleLogout}>Cerrar sesión</AlertDialogCancel>
            <AlertDialogAction onClick={handleStayLoggedIn}>Continuar conectado</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: React.ReactNode
    variant: "default" | "ghost"
    href: string
  }[]
}

function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname()

  return (
    <div data-collapsed={isCollapsed} className="group py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)

          return (
            <Link
              key={index}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-white/20 hover:text-white transition-all",
                isActive ? "bg-white/25 text-white" : "text-white/90",
                isCollapsed && "h-10 w-10 justify-center p-0",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md",
                  isActive
                    ? "bg-primary text-primary-foreground border border-white/30"
                    : "bg-white/10 text-white border border-white/20",
                )}
              >
                {link.icon}
              </div>
              {!isCollapsed && <span>{link.title}</span>}
              {!isCollapsed && link.label && <span className="ml-auto text-xs font-semibold">{link.label}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsCollapsed(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    localStorage.removeItem("userToken")
    localStorage.removeItem("userName")
    localStorage.removeItem("userRole")

    // Redirect to login page
    router.push("/")
  }

  const links = [
    {
      title: "Clientes",
      icon: <Users className="h-4 w-4 text-inherit" />,
      variant: "ghost",
      href: "/dashboard/clients",
    },
    {
      title: "Productos",
      icon: <Package className="h-4 w-4 text-inherit" />,
      variant: "ghost",
      href: "/dashboard/products",
    },
    {
      title: "Pedidos",
      icon: <ClipboardList className="h-4 w-4 text-inherit" />,
      variant: "ghost",
      href: "/dashboard/orders",
    },
    {
      title: "Documentos",
      icon: <FileText className="h-4 w-4 text-inherit" />,
      variant: "ghost",
      href: "/dashboard/docs",
    },
  ]

  const userName = typeof window !== "undefined" ? localStorage.getItem("userName") || "Admin" : "Admin"
  const userInitial = userName.charAt(0).toUpperCase()

  // Get current section name
  const getCurrentSectionName = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname.includes("/clients")) return "Clientes"
    if (pathname.includes("/products")) return "Productos"
    if (pathname.includes("/orders")) return "Pedidos"
    if (pathname.includes("/docs")) return "Documentos"
    return "Dashboard"
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/15">
      {!isMobile && (
        <aside
          className={cn(
            "fixed inset-y-0 z-10 flex h-full flex-col border-r bg-gradient-to-b from-[#2a4747] to-[#439775]",
            isCollapsed ? "sidebar-collapsed" : "sidebar-expanded",
          )}
        >
          <div className="flex h-16 items-center border-b border-white/10 px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center text-[#2a4747] font-bold">
                    SG
                  </div>
                  <span className="text-lg">Sistema de Gestión</span>
                </div>
              )}
              {isCollapsed && (
                <div className="h-10 w-10 rounded-md bg-white flex items-center justify-center text-[#2a4747] font-bold mx-auto">
                  SG
                </div>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 text-white", isCollapsed ? "ml-auto mr-0" : "ml-auto")}
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
          <ScrollArea className="flex-1 px-1 py-2">
            <Nav isCollapsed={isCollapsed} links={links} />
          </ScrollArea>
          <div className="mt-auto p-4 border-t border-white/10">
            <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "justify-between")}>
              {!isCollapsed && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-white/20">
                    <AvatarFallback className="bg-primary text-primary-foreground">{userInitial}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <div className="font-medium text-white">{userName}</div>
                    <div className="text-white/70 text-xs">Administrador</div>
                  </div>
                </div>
              )}
              {isCollapsed && (
                <Avatar className="h-10 w-10 border border-white/20">
                  <AvatarFallback className="bg-primary text-primary-foreground">{userInitial}</AvatarFallback>
                </Avatar>
              )}
              <Button
                variant="ghost"
                size={isCollapsed ? "icon" : "sm"}
                className="text-white hover:bg-white/20 hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Salir</span>}
                <span className="sr-only">Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </aside>
      )}
      <div className={cn("flex w-full flex-col", isMobile ? "ml-0" : isCollapsed ? "ml-[70px]" : "ml-[280px]")}>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 sm:px-6">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] p-0 bg-gradient-to-b from-[#2a4747] to-[#439775] border-r border-white/10"
              >
                <div className="flex h-16 items-center border-b border-white/10 px-4">
                  <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-white">
                    <div className="h-8 w-8 rounded-md bg-white flex items-center justify-center text-[#2a4747] font-bold">
                      SG
                    </div>
                    <span className="text-lg">Sistema de Gestión</span>
                  </Link>
                </div>
                <ScrollArea className="h-[calc(100vh-128px)]">
                  <Nav isCollapsed={false} links={links} />
                </ScrollArea>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-white/20">
                        <AvatarFallback className="bg-primary text-primary-foreground">{userInitial}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium text-white">{userName}</div>
                        <div className="text-white/70 text-xs">Administrador</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 hover:text-white"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Cerrar sesión</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          <div className="flex items-center">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all",
                pathname === "/dashboard" ? "bg-primary/20 text-primary" : "hover:bg-primary/10 text-foreground/80",
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>

          <div className="text-lg font-semibold ml-4 flex-1">{getCurrentSectionName()}</div>

          <div className="flex items-center gap-4">
            <div className="glass-effect px-3 py-1.5 rounded-full flex items-center gap-2">
              <InactivityTimerDisplay />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <div className="glass-effect rounded-xl p-6 bg-white/20">{children}</div>
        </main>
      </div>
    </div>
  )
}
