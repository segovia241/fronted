"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getClientes, getProductos, getPedidos } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Users,
  Package,
  ClipboardList,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    clientCount: 0,
    productCount: 0,
    orderCount: 0,
    totalSales: 0,
    lowStockCount: 0,
    recentOrderCount: 0,
  })
  const [recentClients, setRecentClients] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clients, products, orders] = await Promise.all([getClientes(), getProductos(), getPedidos()])

        // Calculate stats
        const lowStockCount = products.filter((p) => p.cantidad < 5).length
        setLowStockProducts(products.filter((p) => p.cantidad < 5).slice(0, 4))

        // Calculate recent orders (last 7 days)
        const now = new Date()
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const recentOrdersData = orders
          .filter((order) => {
            const orderDate = new Date(order.fecha)
            return orderDate >= sevenDaysAgo
          })
          .slice(0, 4)

        setRecentOrders(recentOrdersData)

        // Get recent clients
        const recentClientsData = clients.slice(0, 4)
        setRecentClients(recentClientsData)

        // Calculate total sales
        const totalSales = orders.reduce((sum, order) => sum + (order.totalVenta || 0), 0)

        setStats({
          clientCount: clients.length,
          productCount: products.length,
          orderCount: orders.length,
          totalSales,
          lowStockCount,
          recentOrderCount: recentOrdersData.length,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const isDark = theme === "dark"

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold tracking-tight ${isDark ? "text-white" : ""}`}>Dashboard</h1>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Bienvenido al panel de administración.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className={`border-0 shadow-sm card-hover-effect ${
            isDark
              ? "bg-gradient-to-br from-indigo-900/50 to-blue-900/50 border-indigo-800/50"
              : "bg-gradient-to-br from-indigo-50 to-blue-50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${isDark ? "text-indigo-300" : "text-indigo-600"}`}>
              Clientes
            </CardTitle>
            <div className={`rounded-full p-2 ${isDark ? "bg-indigo-800/50" : "bg-indigo-100"}`}>
              <Users className={`h-4 w-4 ${isDark ? "text-indigo-300" : "text-indigo-600"}`} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className={`h-8 w-24 ${isDark ? "bg-gray-700" : ""}`} />
            ) : (
              <>
                <div className={`text-2xl font-bold ${isDark ? "text-indigo-300" : "text-indigo-700"}`}>
                  {stats.clientCount}
                </div>
                <p className={`text-xs mt-1 ${isDark ? "text-indigo-400" : "text-indigo-500"}`}>Clientes registrados</p>
                <div className={`mt-3 flex items-center text-xs ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>+{recentClients.length} nuevos esta semana</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card
          className={`border-0 shadow-sm card-hover-effect ${
            isDark
              ? "bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-800/50"
              : "bg-gradient-to-br from-emerald-50 to-teal-50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${isDark ? "text-emerald-300" : "text-emerald-600"}`}>
              Productos
            </CardTitle>
            <div className={`rounded-full p-2 ${isDark ? "bg-emerald-800/50" : "bg-emerald-100"}`}>
              <Package className={`h-4 w-4 ${isDark ? "text-emerald-300" : "text-emerald-600"}`} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className={`h-8 w-24 ${isDark ? "bg-gray-700" : ""}`} />
            ) : (
              <>
                <div className={`text-2xl font-bold ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
                  {stats.productCount}
                </div>
                <p className={`text-xs mt-1 ${isDark ? "text-emerald-400" : "text-emerald-500"}`}>
                  Productos en inventario
                </p>
                <div className={`mt-3 flex items-center text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  <span>{stats.lowStockCount} con stock bajo</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card
          className={`border-0 shadow-sm card-hover-effect ${
            isDark
              ? "bg-gradient-to-br from-amber-900/50 to-orange-900/50 border-amber-800/50"
              : "bg-gradient-to-br from-amber-50 to-orange-50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${isDark ? "text-amber-300" : "text-amber-600"}`}>
              Pedidos
            </CardTitle>
            <div className={`rounded-full p-2 ${isDark ? "bg-amber-800/50" : "bg-amber-100"}`}>
              <ClipboardList className={`h-4 w-4 ${isDark ? "text-amber-300" : "text-amber-600"}`} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className={`h-8 w-24 ${isDark ? "bg-gray-700" : ""}`} />
            ) : (
              <>
                <div className={`text-2xl font-bold ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                  {stats.orderCount}
                </div>
                <p className={`text-xs mt-1 ${isDark ? "text-amber-400" : "text-amber-500"}`}>Pedidos totales</p>
                <div className={`mt-3 flex items-center text-xs ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  <span>{stats.recentOrderCount} en los últimos 7 días</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card
          className={`border-0 shadow-sm card-hover-effect ${
            isDark
              ? "bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 border-purple-800/50"
              : "bg-gradient-to-br from-purple-50 to-fuchsia-50"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${isDark ? "text-purple-300" : "text-purple-600"}`}>
              Ventas
            </CardTitle>
            <div className={`rounded-full p-2 ${isDark ? "bg-purple-800/50" : "bg-purple-100"}`}>
              <DollarSign className={`h-4 w-4 ${isDark ? "text-purple-300" : "text-purple-600"}`} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className={`h-8 w-24 ${isDark ? "bg-gray-700" : ""}`} />
            ) : (
              <>
                <div className={`text-2xl font-bold ${isDark ? "text-purple-300" : "text-purple-700"}`}>
                  ${stats.totalSales.toFixed(2)}
                </div>
                <p className={`text-xs mt-1 ${isDark ? "text-purple-400" : "text-purple-500"}`}>Ventas totales</p>
                <div className={`mt-3 flex items-center text-xs ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>+12% vs. mes anterior</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className={`border-0 shadow-sm ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white"}`}>
          <CardHeader
            className={`${
              isDark
                ? "bg-gradient-to-r from-indigo-900/30 to-blue-900/30 rounded-t-lg border-b border-indigo-800/30"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg"
            }`}
          >
            <div className="flex items-center justify-between">
              <CardTitle className={isDark ? "text-white" : ""}>Clientes Recientes</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className={isDark ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600"}
                onClick={() => router.push("/dashboard/clients")}
              >
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className={`h-10 w-10 rounded-full ${isDark ? "bg-gray-700" : ""}`} />
                      <div className="space-y-2">
                        <Skeleton className={`h-4 w-[150px] ${isDark ? "bg-gray-700" : ""}`} />
                        <Skeleton className={`h-3 w-[100px] ${isDark ? "bg-gray-700" : ""}`} />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentClients.map((client, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isDark ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? "text-white" : ""}`}>
                        {client.apellidos}, {client.nombres}
                      </p>
                      <p className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>DNI: {client.dni}</p>
                    </div>
                  </div>
                ))}
                {recentClients.length === 0 && !loading && (
                  <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    No hay clientes registrados
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-sm ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white"}`}>
          <CardHeader
            className={`${
              isDark
                ? "bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-t-lg border-b border-amber-800/30"
                : "bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg"
            }`}
          >
            <div className="flex items-center justify-between">
              <CardTitle className={isDark ? "text-white" : ""}>Pedidos Recientes</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className={isDark ? "text-amber-400 hover:text-amber-300" : "text-amber-600"}
                onClick={() => router.push("/dashboard/orders")}
              >
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className={`h-10 w-10 rounded-full ${isDark ? "bg-gray-700" : ""}`} />
                      <div className="space-y-2">
                        <Skeleton className={`h-4 w-[150px] ${isDark ? "bg-gray-700" : ""}`} />
                        <Skeleton className={`h-3 w-[100px] ${isDark ? "bg-gray-700" : ""}`} />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isDark ? "bg-amber-900/50 text-amber-300" : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className={`text-sm font-medium ${isDark ? "text-white" : ""}`}>Pedido #{order.idPedido}</p>
                        <p className={`text-sm font-medium ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                          ${order.totalVenta?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                          Cliente: {order.cliente?.idCliente || "N/A"}
                        </p>
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                          {new Date(order.fecha).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && !loading && (
                  <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    No hay pedidos recientes
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-sm ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white"}`}>
          <CardHeader
            className={`${
              isDark
                ? "bg-gradient-to-r from-red-900/30 to-rose-900/30 rounded-t-lg border-b border-red-800/30"
                : "bg-gradient-to-r from-red-50 to-rose-50 rounded-t-lg"
            }`}
          >
            <div className="flex items-center justify-between">
              <CardTitle className={isDark ? "text-white" : ""}>Productos con Stock Bajo</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className={isDark ? "text-red-400 hover:text-red-300" : "text-red-600"}
                onClick={() => router.push("/dashboard/products")}
              >
                Ver todos
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className={`h-10 w-10 rounded-full ${isDark ? "bg-gray-700" : ""}`} />
                      <div className="space-y-2">
                        <Skeleton className={`h-4 w-[150px] ${isDark ? "bg-gray-700" : ""}`} />
                        <Skeleton className={`h-3 w-[100px] ${isDark ? "bg-gray-700" : ""}`} />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        isDark ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-600"
                      }`}
                    >
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className={`text-sm font-medium ${isDark ? "text-white" : ""}`}>{product.descripcion}</p>
                        <p className={`text-sm font-medium ${isDark ? "text-red-400" : "text-red-600"}`}>
                          {product.cantidad} u.
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className={`text-xs ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                          ${product.precio.toFixed(2)}
                        </p>
                        <Badge
                          className={`text-xs ${isDark ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-800"}`}
                        >
                          Stock bajo
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length === 0 && !loading && (
                  <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                    No hay productos con stock bajo
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={`border-0 shadow-sm ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white"}`}>
          <CardHeader
            className={`${
              isDark
                ? "bg-gradient-to-r from-indigo-900/30 to-blue-900/30 rounded-t-lg border-b border-indigo-800/30"
                : "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg"
            }`}
          >
            <CardTitle className={isDark ? "text-white" : ""}>Acciones Rápidas</CardTitle>
            <CardDescription className={isDark ? "text-gray-400" : ""}>
              Accede rápidamente a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                className={`h-auto py-4 ${
                  isDark
                    ? "bg-gradient-to-r from-indigo-800 to-blue-800 hover:from-indigo-700 hover:to-blue-700"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600"
                }`}
                onClick={() => router.push("/dashboard/clients/new")}
              >
                <div className="flex flex-col items-center">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Nuevo Cliente</span>
                </div>
              </Button>
              <Button
                className={`h-auto py-4 ${
                  isDark
                    ? "bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600"
                }`}
                onClick={() => router.push("/dashboard/products/new")}
              >
                <div className="flex flex-col items-center">
                  <Package className="h-6 w-6 mb-2" />
                  <span>Nuevo Producto</span>
                </div>
              </Button>
              <Button
                className={`h-auto py-4 ${
                  isDark
                    ? "bg-gradient-to-r from-amber-800 to-orange-800 hover:from-amber-700 hover:to-orange-700"
                    : "bg-gradient-to-r from-amber-600 to-orange-600"
                }`}
                onClick={() => router.push("/dashboard/orders/new")}
              >
                <div className="flex flex-col items-center">
                  <ClipboardList className="h-6 w-6 mb-2" />
                  <span>Nuevo Pedido</span>
                </div>
              </Button>
              <Button
                className={`h-auto py-4 ${
                  isDark
                    ? "bg-gradient-to-r from-purple-800 to-fuchsia-800 hover:from-purple-700 hover:to-fuchsia-700"
                    : "bg-gradient-to-r from-purple-600 to-fuchsia-600"
                }`}
                onClick={() => router.push("/dashboard/docs")}
              >
                <div className="flex flex-col items-center">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  <span>Ver Documentación</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-sm ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-white"}`}>
          <CardHeader
            className={`${
              isDark
                ? "bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-t-lg border-b border-emerald-800/30"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg"
            }`}
          >
            <CardTitle className={isDark ? "text-white" : ""}>Estado del Sistema</CardTitle>
            <CardDescription className={isDark ? "text-gray-400" : ""}>
              Información sobre el estado actual
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className={`h-5 w-5 mr-2 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
                  <span className={`font-medium ${isDark ? "text-white" : ""}`}>API Conectada</span>
                </div>
                <Badge className={isDark ? "bg-emerald-900/50 text-emerald-300" : "bg-emerald-100 text-emerald-800"}>
                  Activa
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className={`h-5 w-5 mr-2 ${isDark ? "text-blue-400" : "text-blue-500"}`} />
                  <span className={`font-medium ${isDark ? "text-white" : ""}`}>Fecha del Sistema</span>
                </div>
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className={`h-5 w-5 mr-2 ${isDark ? "text-purple-400" : "text-purple-500"}`} />
                  <span className={`font-medium ${isDark ? "text-white" : ""}`}>Sesiones Activas</span>
                </div>
                <Badge className={isDark ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-800"}>
                  1
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className={`h-5 w-5 mr-2 ${isDark ? "text-amber-400" : "text-amber-500"}`} />
                  <span className={`font-medium ${isDark ? "text-white" : ""}`}>Alertas Pendientes</span>
                </div>
                <Badge className={isDark ? "bg-amber-900/50 text-amber-300" : "bg-amber-100 text-amber-800"}>
                  {stats.lowStockCount}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
