"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  ArrowUpDown,
  Eye,
  Grid,
  Smartphone,
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

interface Client {
  id: number
  nombre: string
  email: string
  telefono: string
  direccion: string
  tipo: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<keyof Client | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const router = useRouter()

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("/api/clientes")
        if (!response.ok) {
          throw new Error("Error al cargar clientes")
        }
        const data = await response.json()
        setClients(data)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el cliente")
      }

      setClients(clients.filter((client) => client.id !== id))
      toast({
        title: "Éxito",
        description: "Cliente eliminado correctamente",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      })
    }
  }

  const handleSort = (field: keyof Client) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedClients = [...clients].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const filteredClients = sortedClients.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefono.includes(searchTerm),
  )

  const getClientTypeColor = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "empresa":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "individual":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
          <Users className="h-8 w-8" />
          Clientes
        </h1>
        <Button
          onClick={() => router.push("/dashboard/clients/new")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="mr-2 h-4 w-4" /> Añadir Cliente
        </Button>
      </div>

      <Card className="overflow-hidden border border-gray-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-indigo-800">Lista de Clientes</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-8 bg-white border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <Users className="h-12 w-12 text-indigo-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">No hay clientes</h3>
              <p className="text-gray-500 mt-1">No se encontraron clientes que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("nombre")}>
                      <div className="flex items-center">
                        Nombre
                        {sortField === "nombre" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                      <div className="flex items-center">
                        Email
                        {sortField === "email" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${sortDirection === "asc" ? "transform rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <TableCell className="font-medium">{client.id}</TableCell>
                      <TableCell className="font-medium">{client.nombre}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-indigo-600 mr-1" />
                          <span className="text-gray-700">{client.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-indigo-600 mr-1" />
                          <span className="text-gray-700">{client.telefono}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-indigo-600 mr-1 flex-shrink-0" />
                          <span className="text-gray-700 truncate" title={client.direccion}>
                            {client.direccion}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getClientTypeColor(client.tipo)} font-medium`}>
                          {client.tipo === "empresa" ? (
                            <Grid className="h-3 w-3 mr-1" />
                          ) : (
                            <Smartphone className="h-3 w-3 mr-1" />
                          )}
                          {client.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                            className="border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/clients/edit/${client.id}`)}
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
                                <AlertDialogTitle className="text-red-600">¿Eliminar cliente?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar este cliente?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-gray-300 hover:bg-gray-100">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(client.id)}
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
