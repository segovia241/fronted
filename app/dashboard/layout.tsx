"use client"

import type React from "react"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FileText,
  Package,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InactivityTimer } from "@/lib/inactivity-timer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  useEffect(() => {
    const timer = new InactivityTimer({
      timeout: 5 * 60 * 1000, // 5 minutos
      onTimeout: () => {
        alert("Sesión expirada por inactividad.")
        // Aquí podrías redirigir al login o cerrar sesión
        window.location.href = "/" // redirige al inicio
      },
    })

    timer.start()

    return () => {
      timer.stop()
    }
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/dashboard">
            <Button variant={isActive("/dashboard") ? "default" : "ghost"} className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/products">
            <Button variant={isActive("/dashboard/products") ? "default" : "ghost"} className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Productos
            </Button>
          </Link>
          <Link href="/dashboard/clients">
            <Button variant={isActive("/dashboard/clients") ? "default" : "ghost"} className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Clientes
            </Button>
          </Link>
          <Link href="/dashboard/orders">
            <Button variant={isActive("/dashboard/orders") ? "default" : "ghost"} className="w-full justify-start">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Pedidos
            </Button>
          </Link>
          <Link href="/dashboard/docs">
            <Button variant={isActive("/dashboard/docs") ? "default" : "ghost"} className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Documentación
            </Button>
          </Link>
          <div className="pt-4 mt-4 border-t">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </Link>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Card className="p-6">{children}</Card>
      </main>
    </div>
  )
}
