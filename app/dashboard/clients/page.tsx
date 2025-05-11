"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Search, FileDown, RefreshCw, User2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { getClientes, type Cliente } from "@/lib/data"

export default function ClientsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [clients, setClients] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getClientes()
        setClients(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching clients:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchClients()
  }, [toast])

  // Función para refrescar los datos
  const refreshData = async () => {
    setLoading(true)
    try {
      const data = await getClientes()
      setClients(data)
      toast({
        title: "Datos actualizados",
        description: "La lista de clientes ha sido actualizada",
      })
    } catch (error) {
      console.error("Error refreshing clients:", error)
      toast({
        title: "Error",
        description: "No se pudieron actualizar los clientes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.dni.includes(searchTerm),
  )

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-slate-500 mt-2">Gestiona la información de tus clientes.</p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="list" className="data-[state=active]:bg-white">
              Lista
            </TabsTrigger>
            <TabsTrigger value="grid" className="data-[state=active]:bg-white">
              Tarjetas
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar cliente..."
                className="pl-9 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page on search
                }}
              />
            </div>
            <Button onClick={() => router.push("/dashboard/clients/new")} className="bg-primary">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
            </Button>
          </div>
        </div>

        <TabsContent value="list" className="mt-0">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Todos los clientes</CardTitle>
                  <CardDescription>
                    {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""} en total
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  
                  <Button variant="outline" size="sm" className="h-8" onClick={refreshData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Actualizar
                  </Button>
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
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
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
                          <TableHead className="font-medium">Apellidos</TableHead>
                          <TableHead className="font-medium">Nombres</TableHead>
                          <TableHead className="font-medium hidden md:table-cell">Dirección</TableHead>
                          <TableHead className="font-medium">DNI</TableHead>
                          <TableHead className="font-medium hidden md:table-cell">Teléfono</TableHead>
                          <TableHead className="font-medium hidden md:table-cell">Móvil</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedClients.length > 0 ? (
                          paginatedClients.map((client) => (
                            <TableRow key={client.idCliente} className="hover:bg-slate-50">
                              <TableCell className="font-medium">{client.idCliente}</TableCell>
                              <TableCell>{client.apellidos}</TableCell>
                              <TableCell>{client.nombres}</TableCell>
                              <TableCell className="hidden md:table-cell">{client.direccion}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{client.dni}</Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{client.telefono}</TableCell>
                              <TableCell className="hidden md:table-cell">{client.movil}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">
                              <div className="flex flex-col items-center justify-center text-slate-500">
                                <User2 className="h-8 w-8 mb-2 text-slate-300" />
                                <p>No se encontraron clientes</p>
                                <p className="text-sm text-slate-400">
                                  Intenta con otra búsqueda o añade un nuevo cliente
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
                          {Math.min(currentPage * itemsPerPage, filteredClients.length)}
                        </span>{" "}
                        de <span className="font-medium">{filteredClients.length}</span> resultados
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
        </TabsContent>

        <TabsContent value="grid" className="mt-0">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Vista de tarjetas</CardTitle>
                  <CardDescription>
                    {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""} en total
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex flex-col items-center space-y-3">
                          <Skeleton className="h-16 w-16 rounded-full" />
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-4 w-[100px]" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <>
                  {paginatedClients.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {paginatedClients.map((client) => (
                        <div
                          key={client.idCliente}
                          className="border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all"
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                              <User2 className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="font-medium">{`${client.apellidos}, ${client.nombres}`}</h3>
                            <p className="text-sm text-slate-500 mt-1">{client.dni}</p>
                            <div className="mt-3 pt-3 border-t w-full">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <p className="text-slate-500">Teléfono</p>
                                  <p className="font-medium">{client.telefono || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500">Móvil</p>
                                  <p className="font-medium">{client.movil || "N/A"}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                      <User2 className="h-12 w-12 mb-4 text-slate-300" />
                      <p className="text-lg font-medium">No se encontraron clientes</p>
                      <p className="text-slate-400 mt-1">Intenta con otra búsqueda o añade un nuevo cliente</p>
                      <Button onClick={() => router.push("/dashboard/clients/new")} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                      </Button>
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <p className="text-sm text-slate-500">
                        Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, filteredClients.length)}
                        </span>{" "}
                        de <span className="font-medium">{filteredClients.length}</span> resultados
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
