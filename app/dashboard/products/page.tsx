"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Search, Package2, Edit, Trash2, Loader2, List, RefreshCw } from "lucide-react"
import { type Producto, getProductos, deleteProducto } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
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
import { useToast } from "@/components/ui/use-toast"

export default function ProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showList, setShowList] = useState(false)
  const itemsPerPage = 8

  useEffect(() => {
    if (showList) {
      fetchProducts()
    } else {
      setLoading(false)
    }
  }, [showList])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getProductos()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }

  // Delete product function
  const handleDeleteProduct = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteProducto(id)

      // Update products list
      setProducts(products.filter((product) => product.idProducto !== id))

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente",
      })
    } catch (error: any) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al eliminar el producto",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setProductToDelete(null)
    }
  }

  // Función para editar un producto
  const handleEditProduct = (id: string) => {
    router.push(`/dashboard/products/edit/${id}`)
  }

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity <= 0)
      return {
        label: "Sin stock",
        color: "bg-red-200 text-red-900 border border-red-300",
      }
    if (quantity < 5)
      return {
        label: "Stock bajo",
        color: "bg-amber-200 text-amber-900 border border-amber-300",
      }
    if (quantity < 10)
      return {
        label: "Stock medio",
        color: "bg-blue-200 text-blue-900 border border-blue-300",
      }
    return {
      label: "En stock",
      color: "bg-emerald-200 text-emerald-900 border border-emerald-300",
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        <p className="mt-2 text-slate-600">Gestiona tu inventario de productos.</p>
      </div>

      {!showList ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#2a4747] to-[#439775] p-8 text-white">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm ring-4 ring-white/30">
                <Package2 className="h-16 w-16 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-center mb-4">Gestión de Productos</h2>
            <p className="text-white/90 max-w-2xl mx-auto text-center text-lg mb-8">
              Bienvenido al módulo de productos. Aquí puedes ver, añadir, editar y eliminar los productos de tu
              inventario. Utiliza las opciones a continuación para comenzar.
            </p>
          </div>

          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-[#48bf84]/10 to-[#439775]/5 rounded-xl p-6 border border-[#48bf84]/20 shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#48bf84] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <List className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#2a4747]">Ver Productos</h3>
              <p className="text-slate-600 mb-6">Accede a la lista completa de productos en tu inventario.</p>
              <Button onClick={() => setShowList(true)} className="w-full bg-[#48bf84] hover:bg-[#439775] text-white">
                Listar Productos
              </Button>
            </div>

            <div className="bg-gradient-to-br from-[#e0bad7]/10 to-[#d097bf]/5 rounded-xl p-6 border border-[#e0bad7]/20 shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#e0bad7] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#2a4747]">Nuevo Producto</h3>
              <p className="text-slate-600 mb-6">Añade un nuevo producto a tu inventario.</p>
              <Button
                onClick={() => router.push("/dashboard/products/new")}
                className="w-full bg-[#e0bad7] hover:bg-[#d097bf] text-white"
              >
                Añadir Producto
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-[#48bf84]/30 shadow-md bg-white">
              <CardHeader className="pb-2 border-b border-[#48bf84]/20 bg-[#48bf84]/10">
                <CardTitle className="text-sm font-medium text-[#2a4747]">Total Productos</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-[#2a4747]">{products.length}</div>
                <p className="text-xs mt-1 text-[#439775]">Productos en inventario</p>
              </CardContent>
            </Card>

            <Card className="border border-[#e0bad7]/30 shadow-md bg-white">
              <CardHeader className="pb-2 border-b border-[#e0bad7]/20 bg-[#e0bad7]/10">
                <CardTitle className="text-sm font-medium text-[#2a4747]">Valor de Inventario</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-[#2a4747]">
                  $
                  {loading
                    ? "..."
                    : products.reduce((sum, product) => sum + product.precio * product.cantidad, 0).toFixed(2)}
                </div>
                <p className="text-xs mt-1 text-[#d097bf]">Basado en precios de venta</p>
              </CardContent>
            </Card>

            <Card className="border border-[#2a4747]/30 shadow-md bg-white">
              <CardHeader className="pb-2 border-b border-[#2a4747]/20 bg-[#2a4747]/10">
                <CardTitle className="text-sm font-medium text-[#2a4747]">Productos con Stock Bajo</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-[#2a4747]">
                  {loading ? "..." : products.filter((p) => p.cantidad < 5).length}
                </div>
                <p className="text-xs mt-1 text-gray-600">Menos de 5 unidades disponibles</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-200 shadow-lg bg-white text-gray-900">
            <CardHeader className="pb-0 rounded-t-lg bg-[#2a4747]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="text-white">
                  <CardTitle className="text-white">Lista de Productos</CardTitle>
                  <CardDescription className="text-gray-200">
                    {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} en total
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      type="search"
                      placeholder="Buscar producto..."
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
                      className="gap-2 bg-white text-[#2a4747] border-gray-300 hover:bg-gray-100"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Volver
                    </Button>
                    <Button
                      onClick={() => router.push("/dashboard/products/new")}
                      className="bg-[#48bf84] hover:bg-[#3da873] text-white font-medium"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
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
                          <TableHead className="font-semibold text-[#2a4747]">Descripción</TableHead>
                          <TableHead className="font-semibold text-[#2a4747]">Costo</TableHead>
                          <TableHead className="font-semibold text-[#2a4747]">Precio</TableHead>
                          <TableHead className="font-semibold text-[#2a4747]">Cantidad</TableHead>
                          <TableHead className="font-semibold text-[#2a4747]">Estado</TableHead>
                          <TableHead className="font-semibold text-[#2a4747] w-[100px]">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedProducts.length > 0 ? (
                          paginatedProducts.map((product) => {
                            const stockStatus = getStockStatus(product.cantidad)
                            return (
                              <TableRow key={product.idProducto} className="hover:bg-slate-50">
                                <TableCell className="font-medium">{product.idProducto}</TableCell>
                                <TableCell>{product.descripcion}</TableCell>
                                <TableCell>${Number(product.costo).toFixed(2)}</TableCell>
                                <TableCell>${Number(product.precio).toFixed(2)}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col space-y-1">
                                    <span>{product.cantidad}</span>
                                    <Progress
                                      value={Math.min(product.cantidad * 10, 100)}
                                      className="h-1.5"
                                      indicatorClassName={
                                        product.cantidad <= 0
                                          ? "bg-red-500"
                                          : product.cantidad < 5
                                            ? "bg-amber-500"
                                            : "bg-emerald-500"
                                      }
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={`${stockStatus.color} font-medium`}>{stockStatus.label}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleEditProduct(product.idProducto)}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Editar</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-500"
                                      onClick={() => setProductToDelete(product)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Eliminar</span>
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                              <div className="flex flex-col items-center justify-center">
                                <Package2 className="h-8 w-8 mb-2 text-slate-300" />
                                <p>No se encontraron productos</p>
                                <p className="text-sm text-slate-400">
                                  Intenta con otra búsqueda o añade un nuevo producto
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
                          {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                        </span>{" "}
                        de <span className="font-medium">{filteredProducts.length}</span> resultados
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
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el producto{" "}
              <span className="font-medium">{productToDelete?.descripcion}</span>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => productToDelete && handleDeleteProduct(productToDelete.idProducto)}
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
