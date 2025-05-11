"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Search, FileDown, RefreshCw, ClipboardList, Calendar, User2 } from "lucide-react"
import { type Pedido, getPedidos } from "@/lib/data"
import { type Cliente } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersPage() {

  
  const router = useRouter()
  const [orders, setOrders] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("all")
  const itemsPerPage = 8

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getPedidos()
        setOrders(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(
    (order) =>
      order.cliente?.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente?.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.idPedido.toString().includes(searchTerm),
  )

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-slate-500 mt-2">Gestiona los pedidos de tus clientes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-slate-500 mt-1">Pedidos realizados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Ventas Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${loading ? "..." : orders.reduce((sum, order) => sum + (order.totalVenta || 0), 0).toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Ingresos por pedidos</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pedido Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {loading || orders.length === 0
                ? "0.00"
                : (orders.reduce((sum, order) => sum + (order.totalVenta || 0), 0) / orders.length).toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Valor promedio por pedido</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Clientes Únicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : new Set(orders.map((order) => order.cliente?.idCliente)).size}
            </div>
            <p className="text-xs text-slate-500 mt-1">Clientes con pedidos</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Lista de Pedidos</CardTitle>
              <CardDescription>
                {filteredOrders.length} pedido{filteredOrders.length !== 1 ? "s" : ""} en total
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Buscar pedido..."
                  className="pl-9 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page on search
                  }}
                />
              </div>
              <div className="flex gap-2">
                
                <Button onClick={() => router.push("/dashboard/orders/new")}>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-medium">ID</TableHead>
                      <TableHead className="font-medium">Cliente</TableHead>
                      <TableHead className="font-medium">Fecha</TableHead>
                      <TableHead className="font-medium">SubTotal</TableHead>
                      <TableHead className="font-medium">Total Venta</TableHead>
                      <TableHead className="font-medium">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.length > 0 ? (
                      paginatedOrders.map((order) => (
                        <TableRow
                          key={order.idPedido}
                          className="hover:bg-slate-50"
                          /*onClick={() => router.push(`/dashboard/orders/${order.idPedido}`)}*/
                        >
                          <TableCell className="font-medium">{order.idPedido}</TableCell>
<TableCell>
  <div className="flex items-center">
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
      <User2 className="h-4 w-4 text-primary" />
    </div>
    <div>
      {order.cliente
        ? `${order.cliente.apellidos || ""}, ${order.cliente.nombres || ""}`
        : `Cliente ID: ${order.cliente?.idCliente || "N/A"}`}
    </div>
  </div>
</TableCell>
<TableCell>
  <div className="flex items-center">
    <Calendar className="h-4 w-4 text-slate-400 mr-2" />
    {formatDate(order.fecha)}
  </div>
</TableCell>
<TableCell>${(order.subTotal ?? 0).toFixed(2)}</TableCell>
<TableCell className="font-medium">${(order.totalVenta ?? 0).toFixed(2)}</TableCell>
<TableCell>
  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Completado</Badge>
</TableCell>

                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <ClipboardList className="h-8 w-8 mb-2 text-slate-300" />
                            <p>No se encontraron pedidos</p>
                            <p className="text-sm text-slate-400">Intenta con otra búsqueda o crea un nuevo pedido</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-slate-500">
                    Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span>{" "}
                    de <span className="font-medium">{filteredOrders.length}</span> resultados
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
