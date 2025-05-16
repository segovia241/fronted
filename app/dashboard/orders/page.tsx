"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Search, ClipboardList, Eye, Edit, Trash2, Loader2, List, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { getPedidos, type Pedido, deletePedido } from "@/lib/data"
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

export default function OrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [orderToDelete, setOrderToDelete] = useState<Pedido | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showList, setShowList] = useState(false)
  const itemsPerPage = 8

  useEffect(() => {
    if (showList) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [showList])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const data = await getPedidos()
      setOrders(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  // Delete order function
  const handleDeleteOrder = async (id: string) => {
    setIsDeleting(true)
    try {
      const success = await deletePedido(id)

      if (success) {
        // Update orders list
        setOrders(orders.filter((order) => order.idPedido !== id))

        toast({
          title: "Pedido eliminado",
          description: "El pedido ha sido eliminado exitosamente",
        })
      } else {
        throw new Error("Error al eliminar el pedido")
      }
    } catch (error: any) {
      console.error("Error deleting order:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al eliminar el pedido",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setOrderToDelete(null)
    }
  }

  // Función para ver detalles de un pedido
  const handleViewOrder = (id: string) => {
    router.push(`/dashboard/orders/${id}`)
  }

  // Función para editar un pedido
  const handleEditOrder = (id: string) => {
    router.push(`/dashboard/orders/edit/${id}`)
  }

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      order.idPedido.toLowerCase().includes(searchTermLower) ||
      (order.cliente.apellidos && order.cliente.apellidos.toLowerCase().includes(searchTermLower)) ||
      (order.cliente.nombres && order.cliente.nombres.toLowerCase().includes(searchTermLower))
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <p className="mt-2 text-slate-600">Gestiona los pedidos de tus clientes.</p>
      </div>

      {!showList ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#e0bad7] to-[#d097bf] p-8 text-white">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm ring-4 ring-white/30">
                <ClipboardList className="h-16 w-16 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-4">Gestión de Pedidos</h2>
            <p className="text-white/90 max-w-2xl mx-auto text-center text-lg mb-8">
              Bienvenido al módulo de pedidos. Aquí puedes ver, añadir, editar y eliminar los pedidos de tus clientes.
              Utiliza las opciones a continuación para comenzar.
            </p>
          </div>

          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-[#e0bad7]/10 to-[#d097bf]/5 rounded-xl p-6 border border-[#e0bad7]/20 shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#e0bad7] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <List className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#2a4747]">Ver Pedidos</h3>
              <p className="text-slate-600 mb-6">Accede a la lista completa de pedidos de tus clientes.</p>
              <Button onClick={() => setShowList(true)} className="w-full bg-[#e0bad7] hover:bg-[#d097bf] text-white">
                Listar Pedidos
              </Button>
            </div>

            <div className="bg-gradient-to-br from-[#48bf84]/10 to-[#439775]/5 rounded-xl p-6 border border-[#48bf84]/20 shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#48bf84] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#2a4747]">Nuevo Pedido</h3>
              <p className="text-slate-600 mb-6">Crea un nuevo pedido para tus clientes.</p>
              <Button
                onClick={() => router.push("/dashboard/orders/new")}
                className="w-full bg-[#48bf84] hover:bg-[#439775] text-white"
              >
                Añadir Pedido
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-[#e0bad7]/30 shadow-md bg-white">
              <CardHeader className="pb-2 border-b border-[#e0bad7]/20 bg-[#e0bad7]/10">
                <CardTitle className="text-sm font-medium text-[#2a4747]">Total Pedidos</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-[#2a4747]">{orders.length}</div>
                <p className="text-xs mt-1 text-[#d097bf]">Pedidos registrados</p>
              </CardContent>
            </Card>

            <Card className="border border-[#48bf84]/30 shadow-md bg-white">
              <CardHeader className="pb-2 border-b border-[#48bf84]/20 bg-[#48bf84]/10">
                <CardTitle className="text-sm font-medium text-[#2a4747]">Valor Total</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-[#2a4747]">
                  ${loading ? "..." : orders.reduce((sum, order) => sum + order.totalVenta, 0).toFixed(2)}
                </div>
                <p className="text-xs mt-1 text-[#439775]">Valor total de pedidos</p>
              </CardContent>
            </Card>

            <Card className="border border-[#2a4747]/30 shadow-md bg-white">
              <CardHeader className="pb-2 border-b border-[#2a4747]/20 bg-[#2a4747]/10">
                <CardTitle className="text-sm font-medium text-[#2a4747]">Pedidos Recientes</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-[#2a4747]">
                  {loading
                    ? "..."
                    : orders.filter((o) => {
                        const orderDate = new Date(o.fecha)
                        const now = new Date()
                        const diffTime = Math.abs(now.getTime() - orderDate.getTime())
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                        return diffDays <= 7
                      }).length}
                </div>
                <p className="text-xs mt-1 text-gray-600">Pedidos en los últimos 7 días</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-200 shadow-lg bg-white text-gray-900">
            <CardHeader className="pb-0 rounded-t-lg bg-[#d097bf]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="text-white">
                  <CardTitle className="text-white">Lista de Pedidos</CardTitle>
                  <CardDescription className="text-gray-100">
                    {filteredOrders.length} pedido{filteredOrders.length !== 1 ? "s" : ""} en total
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="search"
                      placeholder="Buscar pedido..."
                      className="pl-9 w-full sm:w-[250px] bg-white border-gray-300"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1) // Reset to first page on search
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowList(false)}
                      className="gap-2 bg-white text-[#d097bf] border-gray-300 hover:bg-gray-100"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Volver
                    </Button>
                    <Button
                      onClick={() => router.push("/dashboard/orders/new")}
                      className="bg-[#48bf84] hover:bg-[#3da873] text-white font-medium"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 bg-white">
              {loading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-md bg-slate-200" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[250px] bg-slate-200" />
                          <Skeleton className="h-4 w-[200px] bg-slate-200" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <>
                  <div className="rounded-md border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead className="font-semibold text-[#2a4747]">ID</TableHead>
                          <TableHead className="font-semibold text-[#2a4747]">Cliente</TableHead>
                          <TableHead className="font-semibold text-[#2a4747]">Fecha</TableHead>
                          <TableHead className="font-semibold text-[#2a4747] text-right">Subtotal</TableHead>
                          <TableHead className="font-semibold text-[#2a4747] text-right">Total</TableHead>
                          <TableHead className="font-semibold text-[#2a4747] w-[120px]">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedOrders.length > 0 ? (
                          paginatedOrders.map((order) => (
                            <TableRow key={order.idPedido} className="hover:bg-slate-50">
                              <TableCell className="font-medium">
                                <Badge
                                  variant="outline"
                                  className="bg-[#e0bad7]/30 text-[#2a4747] hover:bg-[#e0bad7]/40 border-[#e0bad7]/50 font-medium"
                                >
                                  #{order.idPedido}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {order.cliente.apellidos && order.cliente.nombres
                                  ? `${order.cliente.apellidos}, ${order.cliente.nombres}`
                                  : `Cliente ${order.cliente.idCliente}`}
                              </TableCell>
                              <TableCell>{formatDate(order.fecha)}</TableCell>
                              <TableCell className="text-right">${order.subTotal.toFixed(2)}</TableCell>
                              <TableCell className="text-right font-medium">${order.totalVenta.toFixed(2)}</TableCell>
                              <TableCell>
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleViewOrder(order.idPedido)}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Ver</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleEditOrder(order.idPedido)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Editar</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500"
                                    onClick={() => setOrderToDelete(order)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-slate-500">
                              <div className="flex flex-col items-center justify-center">
                                <ClipboardList className="h-8 w-8 mb-2 text-slate-300" />
                                <p>No se encontraron pedidos</p>
                                <p className="text-sm text-slate-400">
                                  Intenta con otra búsqueda o crea un nuevo pedido
                                </p>
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
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
                        </span>{" "}
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
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el pedido{" "}
              <span className="font-medium">#{orderToDelete?.idPedido}</span>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => orderToDelete && handleDeleteOrder(orderToDelete.idPedido)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
