"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Search, FileDown, RefreshCw, Package2 } from "lucide-react"
import { type Producto, getProductos } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductos()
        setProducts(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Get stock status
  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { label: "Sin stock", color: "bg-red-100 text-red-800" }
    if (quantity < 5) return { label: "Stock bajo", color: "bg-amber-100 text-amber-800" }
    if (quantity < 10) return { label: "Stock medio", color: "bg-blue-100 text-blue-800" }
    return { label: "En stock", color: "bg-emerald-100 text-emerald-800" }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Productos</h1>
        <p className="text-slate-500 mt-2">Gestiona tu inventario de productos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-slate-500 mt-1">Productos en inventario</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Valor de Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {loading
                ? "..."
                : products.reduce((sum, product) => sum + product.precio * product.cantidad, 0).toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Basado en precios de venta</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Productos con Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : products.filter((p) => p.cantidad < 5).length}</div>
            <p className="text-xs text-slate-500 mt-1">Menos de 5 unidades disponibles</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""} en total
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Buscar producto..."
                  className="pl-9 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1) // Reset to first page on search
                  }}
                />
              </div>
              <div className="flex gap-2">
                
                <Button onClick={() => router.push("/dashboard/products/new")}>
                  <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
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
                      <TableHead className="font-medium">Descripción</TableHead>
                      <TableHead className="font-medium">Costo</TableHead>
                      <TableHead className="font-medium">Precio</TableHead>
                      <TableHead className="font-medium">Cantidad</TableHead>
                      <TableHead className="font-medium">Estado</TableHead>
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
  <TableCell>${product.costo.toFixed(2)}</TableCell>
  <TableCell>${product.precio.toFixed(2)}</TableCell>
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
    <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
  </TableCell>
</TableRow>

                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          <div className="flex flex-col items-center justify-center text-slate-500">
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
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span>{" "}
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
    </div>
  )
}
