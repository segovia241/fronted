"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ShoppingCart,
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  User,
  ArrowUpDown,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

interface Order {
  id: number
  fecha: string
  estado: string
  total: number
  cliente_id: number
  cliente_nombre: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<keyof Order | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/pedidos")
        if (!response.ok) {
          throw new Error("Error al cargar pedidos")
        }
        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los pedidos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/pedidos/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el pedido")
      }

      setOrders(orders.filter((order) => order.id !== id))
      toast({
        title: "Éxito",
        description: "Pedido eliminado correctamente",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el pedido",
        variant: "destructive",
      })
    }
  }

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const filteredOrders = sortedOrders.filter(
    (order) =>
      order.cliente_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm),
  )

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  const getOrderStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "en proceso":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "enviado":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "entregado":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return <Clock className="h-3 w-3 mr-1" />
      case "en proceso":
        return <AlertCircle className="h-3 w-3 mr-1" />
      case "enviado":
        return <Truck className="h-3 w-3 mr-1" />
      case "entregado":
        return <CheckCircle className="h-3 w-3 mr-1" />
      case "cancelado":
        return <XCircle className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
          <ShoppingCart className="h-8 w-8" />
          Pedidos
        </h1>
        <Button
          onClick={() => router.push("/dashboard/orders/new")}
          className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="mr-2 h-4 w-4" /> Añadir Pedido
        </Button>
      </div>

      <Card className="overflow-hidden border border-gray-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-purple-800">Lista de Pedidos</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar pedidos..."
                className="pl-8 bg-white border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <ShoppingCart className="h-12 w-12 text-purple-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">No hay pedidos</h3>
              <p className="text-gray-500 mt-1">No se encontraron pedidos que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("fecha")}>
                      <div className="flex items-center">
                        Fecha
                        {sortField === "fecha" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("cliente_nombre")}>
                      <div className="flex items-center">
                        Cliente
                        {sortField === "cliente_nombre" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("estado")}>
                      <div className="flex items-center">
                        Estado
                        {sortField === "estado" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("total")}>
                      <div className="flex items-center">
                        Total
                        {sortField === "total" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-purple-600 mr-1" />
                          <span className="text-gray-700">{formatDate(order.fecha)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-purple-600 mr-1" />
                          <span className="text-gray-700">{order.cliente_nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getOrderStatusColor(order.estado)} font-medium flex items-center w-fit`}
                        >
                          {getStatusIcon(order.estado)}
                          {order.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                            className="border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/orders/edit/${order.id}`)}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-red-100">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-red-600">¿Eliminar pedido?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este pedido?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-300 hover:bg-gray-100">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(order.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
