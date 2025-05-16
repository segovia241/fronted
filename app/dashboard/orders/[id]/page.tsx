"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Package, ShoppingCart, FileText, RefreshCw } from "lucide-react"
import { type DetallePedido, getDetallesPedido } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { use } from "react"

export default function DetallesPedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const unwrappedParams = use(params)
  const idPedido = unwrappedParams.id

  const [detalles, setDetalles] = useState<DetallePedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const data = await getDetallesPedido(idPedido)
        setDetalles(data)
        setLoading(false)
      } catch (err) {
        setError("Error al cargar los detalles del pedido")
        setLoading(false)
        console.error(err)
      }
    }

    fetchDetalles()
  }, [idPedido])

  // Calcular totales
  const totalItems = detalles.reduce((sum, item) => sum + item.cantidad, 0)
  const subTotal = detalles.reduce((sum, item) => sum + item.totalDeta, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Pedidos
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Detalles del Pedido #{idPedido}</h1>
          <p className="text-slate-500 mt-2">Información detallada del pedido seleccionado.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Estado del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Completado</Badge>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : totalItems}</div>
            <p className="text-xs text-slate-500 mt-1">Productos en este pedido</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-24" /> : `$${subTotal.toFixed(2)}`}
            </div>
            <p className="text-xs text-slate-500 mt-1">Valor total del pedido</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Productos del Pedido</CardTitle>
              <CardDescription>
                {loading
                  ? "Cargando..."
                  : `${detalles.length} producto${detalles.length !== 1 ? "s" : ""} en este pedido`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array(3)
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
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">{error}</div>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reintentar
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-medium">ID Producto</TableHead>
                      <TableHead className="font-medium">Cantidad</TableHead>
                      <TableHead className="font-medium">Precio Unitario</TableHead>
                      <TableHead className="font-medium">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalles.length > 0 ? (
                      detalles.map((detalle, index) => (
                        <TableRow key={index} className="hover:bg-slate-50">
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                <Package className="h-4 w-4 text-primary" />
                              </div>
                              {detalle.idProd}
                            </div>
                          </TableCell>
                          <TableCell>{detalle.cantidad}</TableCell>
                          <TableCell>${detalle.precio.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">${detalle.totalDeta.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <ShoppingCart className="h-8 w-8 mb-2 text-slate-300" />
                            <p>No se encontraron detalles para este pedido</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Subtotal:</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Impuestos:</span>
                  <span>$0.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-2 font-bold">
                  <span>Total:</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
