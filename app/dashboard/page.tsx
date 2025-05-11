"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Users,
  Package,
  ClipboardList,
  DollarSign,
  ShoppingCart,
  BarChart3,
  ArrowRight,
  ArrowUpRight,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getClientes, getProductos, getPedidos } from "@/lib/data"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProductos: 0,
    totalPedidos: 0,
    totalVentas: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientes = await getClientes()
        const productos = await getProductos()
        const pedidos = await getPedidos()

        const totalVentas = pedidos.reduce((sum, pedido) => sum + (pedido.totalVenta || 0), 0)

        setStats({
          totalClientes: clientes.length,
          totalProductos: productos.length,
          totalPedidos: pedidos.length,
          totalVentas,
        })

        // Get 5 most recent orders
        const sortedOrders = [...pedidos]
          .sort((a, b) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          })
          .slice(0, 5)

        setRecentOrders(sortedOrders)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    {
      title: "Total Clientes",
      value: stats.totalClientes,
      description: "Clientes registrados",
      icon: Users,
      color: "bg-blue-500",
      link: "/dashboard/clients",
    },
    {
      title: "Total Productos",
      value: stats.totalProductos,
      description: "Productos en inventario",
      icon: Package,
      color: "bg-emerald-500",
      link: "/dashboard/products",
    },
    {
      title: "Total Pedidos",
      value: stats.totalPedidos,
      description: "Pedidos realizados",
      icon: ClipboardList,
      color: "bg-amber-500",
      link: "/dashboard/orders",
    },
    {
      title: "Ventas Totales",
      value: `$${stats.totalVentas.toFixed(2)}`,
      description: "Ingresos generados",
      icon: DollarSign,
      color: "bg-indigo-500",
      link: "/dashboard/orders",
    },
  ]

  const quickActions = [
    {
      title: "Nuevo Cliente",
      description: "Registrar un nuevo cliente",
      icon: Users,
      link: "/dashboard/clients/new",
    },
    {
      title: "Nuevo Producto",
      description: "Añadir un nuevo producto",
      icon: Package,
      link: "/dashboard/products/new",
    },
    {
      title: "Nuevo Pedido",
      description: "Crear un nuevo pedido",
      icon: ShoppingCart,
      link: "/dashboard/orders/new",
    },
    {
      title: "Documentación",
      description: "Ver la documentación del sistema",
      icon: ClipboardList,
      link: "/dashboard/docs",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Cargando información del dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-2">Bienvenido al panel de administración del sistema.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
            <CardFooter className="pt-0">
              <Link href={stat.link} className="text-xs text-primary flex items-center">
                Ver detalles
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Pedidos Recientes</CardTitle>
              <Link href="/dashboard/orders">
                <Button variant="ghost" size="sm" className="text-primary">
                  Ver todos
                </Button>
              </Link>
            </div>
            <CardDescription>Los últimos 5 pedidos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((pedido) => (
                  <div
                    key={pedido.idPedido}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">Pedido #{pedido.idPedido}</p>
                      <p className="text-sm text-slate-500">
                        {pedido.cliente
                          ? `${pedido.cliente.apellidos || ""}, ${pedido.cliente.nombres || ""}`
                          : `Cliente ID: ${pedido.cliente?.idCliente || "N/A"}`}
                      </p>
                      <p className="text-xs text-slate-400">{pedido.fecha}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${pedido.totalVenta?.toFixed(2) || "0.00"}</p>
                      <div className="inline-flex items-center text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                        <span>Completado</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-500">No hay pedidos recientes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accesos directos a funciones comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.link}>
                  <div className="group border border-slate-200 rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <action.icon className="h-4 w-4" />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Resumen del Sistema</CardTitle>
          <CardDescription>Información general sobre el sistema de administración</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Estadísticas</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Visualiza las estadísticas clave del negocio, incluyendo ventas, clientes y productos.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Gestión de Clientes</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Administra la información de tus clientes, incluyendo datos personales y de contacto.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Inventario</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Controla tu inventario de productos, precios, costos y cantidades disponibles.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Link href="/dashboard/docs">
                <Button variant="outline" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Ver documentación completa
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
