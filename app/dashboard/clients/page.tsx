"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Search, RefreshCw, User2, Edit, Trash2, List, Loader2, UserPlus, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { getClientes, deleteCliente, type Cliente } from "@/lib/data"
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

export default function ClientsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [clients, setClients] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [clientToDelete, setClientToDelete] = useState<Cliente | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showList, setShowList] = useState(false)
  const itemsPerPage = 8

  useEffect(() => {
    if (showList) {
      fetchClients()
    } else {
      setLoading(false)
    }
  }, [showList])

  const fetchClients = async () => {
    setLoading(true)
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

  // Función para eliminar un cliente
  const handleDeleteClient = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteCliente(id)

      // Actualizar la lista de clientes
      setClients(clients.filter((client) => client.idCliente !== id))

      toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado exitosamente",
      })
    } catch (error: any) {
      console.error("Error deleting client:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al eliminar el cliente",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setClientToDelete(null)
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

  // Función para editar un cliente
  const handleEditClient = (id: string) => {
    router.push(`/dashboard/clients/edit/${id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="mt-2 text-slate-600">Gestiona la información de tus clientes.</p>
      </div>

      {!showList ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#61d095] to-[#48bf84] p-8 text-white">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm ring-4 ring-white/30">
                <Users className="h-16 w-16 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-4">Gestión de Clientes</h2>
            <p className="text-white/90 max-w-2xl mx-auto text-center text-lg mb-8">
              Administra tu base de clientes de manera eficiente. Añade nuevos clientes, actualiza su información y
              mantén un registro completo de todos tus contactos.
            </p>
          </div>

          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-[#61d095]/10 to-[#48bf84]/5 rounded-xl p-6 border border-[#61d095]/20 shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#61d095] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <List className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#2a4747]">Ver Clientes</h3>
              <p className="text-slate-600 mb-6">Accede a la lista completa de clientes registrados.</p>
              <Button onClick={() => setShowList(true)} className="w-full bg-[#61d095] hover:bg-[#48bf84] text-white">
                Listar Clientes
              </Button>
            </div>

            <div className="bg-gradient-to-br from-[#2a4747]/10 to-[#439775]/5 rounded-xl p-6 border border-[#2a4747]/20 shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#2a4747] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#2a4747]">Nuevo Cliente</h3>
              <p className="text-slate-600 mb-6">Registra un nuevo cliente en el sistema.</p>
              <Button
                onClick={() => router.push("/dashboard/clients/new")}
                className="w-full bg-[#2a4747] hover:bg-[#1e3535] text-white"
              >
                Añadir Cliente
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-[#61d095]/30 shadow-md bg-white">
              <CardHeader className="pb-2 border-b border-[#61d095]/20 bg-[#61d095]/10">
                <CardTitle className="text-sm font-medium text-[#2a4747]">Total Clientes</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-[#2a4747]">{clients.length}</div>
                <p className="text-xs mt-1 text-[#48bf84]">Clientes registrados</p>
              </CardContent>
            </Card>

            <Card className="border border-[#48bf84]/30 shadow-md bg-white">
              <CardHeader className="pb-2 border-b border-[#48bf84]/20 bg-[#48bf84]/10">
                <CardTitle className="text-sm font-medium text-[#2a4747]">Clientes Activos</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-[#2a4747]">{clients.length}</div>
                <p className="text-xs mt-1 text-[#439775]">Clientes con pedidos recientes</p>
              </CardContent>
            </Card>

            <Card className="border border-[#2a4747]/30 shadow-md bg-white">
              <CardHeader className="pb-2 border-b border-[#2a4747]/20 bg-[#2a4747]/10">
                <CardTitle className="text-sm font-medium text-[#2a4747]">Nuevos Clientes</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-[#2a4747]">3</div>
                <p className="text-xs mt-1 text-gray-600">Clientes nuevos este mes</p>
              </CardContent>
            </Card>
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
                    className="pl-9 w-full sm:w-[250px] bg-white"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1) // Reset to first page on search
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowList(false)} className="gap-2 bg-white">
                    <RefreshCw className="h-4 w-4" />
                    Volver
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard/clients/new")}
                    className="bg-[#2a4747] hover:bg-[#1e3535] text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value="list" className="mt-0">
              <Card className="border border-gray-200 shadow-lg bg-white text-gray-900">
                <CardHeader className="pb-0 rounded-t-lg bg-[#48bf84]">
                  <div className="flex justify-between items-center">
                    <div className="text-white">
                      <CardTitle className="text-white">Todos los clientes</CardTitle>
                      <CardDescription className="text-gray-100">
                        {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""} en total
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 bg-white text-[#48bf84] border-gray-300 hover:bg-gray-100"
                        onClick={refreshData}
                        disabled={loading}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Actualizar
                      </Button>
                      <Button
                        onClick={() => router.push("/dashboard/clients/new")}
                        className="bg-[#2a4747] hover:bg-[#1e3535] text-white h-8"
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                      </Button>
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
                            <Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
                            <div className="space-y-2">
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
                              <TableHead className="font-semibold text-[#2a4747]">Apellidos</TableHead>
                              <TableHead className="font-semibold text-[#2a4747]">Nombres</TableHead>
                              <TableHead className="font-semibold text-[#2a4747] hidden md:table-cell">
                                Dirección
                              </TableHead>
                              <TableHead className="font-semibold text-[#2a4747]">DNI</TableHead>
                              <TableHead className="font-semibold text-[#2a4747] hidden md:table-cell">
                                Teléfono
                              </TableHead>
                              <TableHead className="font-semibold text-[#2a4747] hidden md:table-cell">Móvil</TableHead>
                              <TableHead className="font-semibold text-[#2a4747] w-[100px]">Acciones</TableHead>
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
                                    <Badge
                                      variant="outline"
                                      className="bg-[#61d095]/30 text-[#2a4747] hover:bg-[#61d095]/40 border-[#61d095]/50 font-medium"
                                    >
                                      {client.dni}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="hidden md:table-cell">{client.telefono}</TableCell>
                                  <TableCell className="hidden md:table-cell">{client.movil}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleEditClient(client.idCliente)}
                                      >
                                        <Edit className="h-4 w-4" />
                                        <span className="sr-only">Editar</span>
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500"
                                        onClick={() => setClientToDelete(client)}
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
                                <TableCell colSpan={8} className="text-center h-24 text-slate-500">
                                  <div className="flex flex-col items-center justify-center">
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
              <Card className="border-0 shadow-lg bg-white text-gray-900">
                <CardHeader className="pb-0 rounded-t-lg bg-[#48bf84]">
                  <div className="flex justify-between items-center">
                    <div className="text-white">
                      <CardTitle className="text-white">Vista de tarjetas</CardTitle>
                      <CardDescription className="text-gray-100">
                        {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""} en total
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => router.push("/dashboard/clients/new")}
                      className="bg-[#2a4747] hover:bg-[#1e3535] text-white h-8"
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array(8)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="border rounded-lg p-4 border-gray-200">
                            <div className="flex flex-col items-center space-y-3">
                              <Skeleton className="h-16 w-16 rounded-full bg-slate-200" />
                              <Skeleton className="h-4 w-[150px] bg-slate-200" />
                              <Skeleton className="h-4 w-[100px] bg-slate-200" />
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
                              className="border rounded-lg p-4 transition-all border-gray-200 hover:border-[#61d095] hover:shadow-md bg-white"
                            >
                              <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#61d095] to-[#48bf84] flex items-center justify-center mb-3">
                                  <User2 className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-medium">{`${client.apellidos}, ${client.nombres}`}</h3>
                                <p className="text-sm mt-1 text-slate-500">{client.dni}</p>
                                <div className="mt-3 pt-3 border-t w-full border-gray-200">
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
                                <div className="mt-4 flex gap-2 w-full">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 bg-white"
                                    onClick={() => handleEditClient(client.idCliente)}
                                  >
                                    <Edit className="h-3 w-3 mr-1" /> Editar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => setClientToDelete(client)}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" /> Eliminar
                                  </Button>
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
                          <Button
                            onClick={() => router.push("/dashboard/clients/new")}
                            className="mt-4 bg-[#2a4747] hover:bg-[#1e3535] text-white"
                          >
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
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al cliente{" "}
              <span className="font-medium">
                {clientToDelete?.apellidos}, {clientToDelete?.nombres}
              </span>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => clientToDelete && handleDeleteClient(clientToDelete.idCliente)}
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
