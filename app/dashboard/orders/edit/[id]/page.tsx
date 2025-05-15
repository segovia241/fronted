"use client"

import type React from "react"
import { use } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash, ArrowLeft, Calendar, User2, Package, Plus, AlertTriangle, Save, Loader2 } from "lucide-react"
import {
  type Cliente,
  type Producto,
  getClientes,
  getProductos,
  getPedido,
  getDetallesPedido,
  updatePedido,
} from "@/lib/data"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function EditOrderPage({ params }: { params: { id: string } }) {
  // Usar React.use para desenvolver params.id
  const id = use(params).id

  const router = useRouter()
  const { toast } = useToast()
  const [clients, setClients] = useState<Cliente[]>([])
  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [selectedClient, setSelectedClient] = useState("")
  const [orderDate, setOrderDate] = useState("")
  const [orderDetails, setOrderDetails] = useState<
    Array<{
      idProd: string
      cantidad: number
      precio: number
      totalDeta: number
      descripcion: string
    }>
  >([])

  const [newProduct, setNewProduct] = useState({
    idProducto: "",
    cantidad: "1",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clients and products
        const [clientsData, productsData, orderData, orderDetailsData] = await Promise.all([
          getClientes(),
          getProductos(),
          getPedido(id),
          getDetallesPedido(id),
        ])

        setClients(clientsData)
        setProducts(productsData)

        if (orderData) {
          setSelectedClient(orderData.cliente.idCliente)
          setOrderDate(orderData.fecha)
        } else {
          setError("Pedido no encontrado")
        }

        // Transform order details
        if (orderDetailsData && orderDetailsData.length > 0) {
          const details = orderDetailsData.map((detail) => {
            const product = productsData.find((p) => p.idProducto === detail.idProd)
            return {
              idProd: detail.idProd,
              cantidad: detail.cantidad,
              precio: detail.precio,
              totalDeta: detail.totalDeta,
              descripcion: product?.descripcion || `Producto ${detail.idProd}`,
            }
          })
          setOrderDetails(details)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Error al cargar los datos")
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleAddProduct = () => {
    if (!newProduct.idProducto || Number.parseInt(newProduct.cantidad) <= 0) {
      setError("Seleccione un producto y una cantidad válida")
      return
    }

    const productId = newProduct.idProducto
    const product = products.find((p) => p.idProducto === productId)

    if (!product) {
      setError("Producto no encontrado")
      return
    }

    const cantidad = Number.parseInt(newProduct.cantidad)

    if (cantidad > product.cantidad) {
      setError(`Solo hay ${product.cantidad} unidades disponibles de este producto`)
      return
    }

    // Check if product already exists in order
    const existingIndex = orderDetails.findIndex((item) => item.idProd === productId)

    if (existingIndex >= 0) {
      // Update existing product quantity
      const updatedDetails = [...orderDetails]
      const newQuantity = updatedDetails[existingIndex].cantidad + cantidad

      if (newQuantity > product.cantidad) {
        setError(`Solo hay ${product.cantidad} unidades disponibles de este producto`)
        return
      }

      updatedDetails[existingIndex].cantidad = newQuantity
      updatedDetails[existingIndex].totalDeta = newQuantity * updatedDetails[existingIndex].precio
      setOrderDetails(updatedDetails)
    } else {
      // Add new product
      setOrderDetails([
        ...orderDetails,
        {
          idProd: productId,
          cantidad: cantidad,
          precio: product.precio,
          totalDeta: cantidad * product.precio,
          descripcion: product.descripcion,
        },
      ])
    }

    // Reset new product form
    setNewProduct({
      idProducto: "",
      cantidad: "1",
    })

    setError("")
  }

  const handleRemoveProduct = (index: number) => {
    const updatedDetails = [...orderDetails]
    updatedDetails.splice(index, 1)
    setOrderDetails(updatedDetails)
  }

  const calculateSubTotal = () => {
    return orderDetails.reduce((sum, item) => sum + item.totalDeta, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClient) {
      setError("Seleccione un cliente")
      return
    }

    if (orderDetails.length === 0) {
      setError("Agregue al menos un producto al pedido")
      return
    }

    const subTotal = calculateSubTotal()

    try {
      setSubmitting(true)

      // Prepare order details for API
      const details = orderDetails.map((item) => ({
        idProd: item.idProd,
        cantidad: item.cantidad,
        precio: item.precio,
        totalDeta: item.totalDeta,
      }))

      const result = await updatePedido(
        id,
        {
          cliente: {
            idCliente: selectedClient,
          },
          fecha: orderDate,
          subTotal: subTotal,
          totalVenta: subTotal, // En este ejemplo, totalVenta equals subTotal
        },
        details,
      )

      if (!result.success) {
        throw new Error(result.message)
      }

      toast({
        title: "Pedido actualizado",
        description: "El pedido ha sido actualizado exitosamente",
      })

      router.push("/dashboard/orders")
    } catch (error: any) {
      console.error("Error updating order:", error)
      setError(error.message || "Ocurrió un error al actualizar el pedido")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/orders">Pedidos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Editar Pedido</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Editar Pedido</h1>
              <p className="text-slate-500 mt-2">Cargando datos del pedido...</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard/orders")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Cargando datos del pedido...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/orders">Pedidos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Editar Pedido #{id}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Pedido</h1>
            <p className="text-slate-500 mt-2">Actualiza los datos del pedido.</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard/orders")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm lg:col-span-2 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle>Información del Pedido</CardTitle>
            <CardDescription>Actualiza los datos del pedido y añade o elimina productos.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-appear flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Datos del Pedido</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="client" className="text-sm font-medium">
                      Cliente
                    </Label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

                      <Select value={selectedClient} onValueChange={setSelectedClient}>
                        <SelectTrigger id="client" className="pl-10">
                          <SelectValue placeholder="Seleccione un cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client, index) => {
                            if (!client.idCliente || client.idCliente === "") {
                              return null
                            }
                            return (
                              <SelectItem
                                key={client.idCliente || `invalid-${index}`}
                                value={client.idCliente?.toString() || ""}
                              >
                                {`${client.apellidos}, ${client.nombres}`}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      Fecha
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        id="date"
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Detalle del Pedido</h3>
                  <Badge variant="outline" className="font-normal bg-indigo-50 text-indigo-700 border-indigo-200">
                    {orderDetails.length} producto{orderDetails.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="space-y-2 md:col-span-6">
                    <Label htmlFor="product" className="text-sm font-medium">
                      Producto
                    </Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

                      <Select
                        value={newProduct.idProducto}
                        onValueChange={(value) => {
                          setNewProduct({ ...newProduct, idProducto: value })
                        }}
                      >
                        <SelectTrigger id="product" className="pl-10">
                          <SelectValue placeholder="Seleccione un producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product, index) => {
                            if (!product.idProducto || product.idProducto === "") {
                              return null
                            }

                            return (
                              <SelectItem
                                key={product.idProducto || `invalid-${index}`}
                                value={product.idProducto?.toString() || ""}
                                disabled={product.cantidad <= 0}
                              >
                                {product.descripcion} - ${product.precio.toFixed(2)} ({product.cantidad} disponibles)
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="quantity" className="text-sm font-medium">
                      Cantidad
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newProduct.cantidad}
                      onChange={(e) => setNewProduct({ ...newProduct, cantidad: e.target.value })}
                      className="pl-3"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <Button
                      type="button"
                      onClick={handleAddProduct}
                      className="w-full bg-gradient-primary"
                      disabled={!newProduct.idProducto}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-medium">Producto</TableHead>
                        <TableHead className="font-medium text-right">Cantidad</TableHead>
                        <TableHead className="font-medium text-right">Precio</TableHead>
                        <TableHead className="font-medium text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderDetails.length > 0 ? (
                        orderDetails.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell>{detail.descripcion}</TableCell>
                            <TableCell className="text-right">{detail.cantidad}</TableCell>
                            <TableCell className="text-right">${detail.precio.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-medium">${detail.totalDeta.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(index)}>
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center h-24">
                            <div className="flex flex-col items-center justify-center text-slate-500">
                              <Package className="h-8 w-8 mb-2 text-slate-300" />
                              <p>No hay productos en el pedido</p>
                              <p className="text-sm text-slate-400">
                                Añade productos utilizando el formulario superior
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/orders")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting} className="gap-2 bg-gradient-primary">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Guardar cambios</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle>Resumen del Pedido</CardTitle>
              <CardDescription>Información calculada del pedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Total del Pedido</p>
                <p className="text-2xl font-bold mt-1 text-indigo-600">${calculateSubTotal().toFixed(2)}</p>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal:</span>
                    <span className="font-medium">${calculateSubTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Impuestos:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Descuentos:</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-700">Total:</span>
                    <span className="text-indigo-600">${calculateSubTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedClient ? (
                (() => {
                  const client = clients.find((c) => c.idCliente === selectedClient)
                  if (!client) return <p className="text-sm text-slate-500">Cliente no encontrado</p>

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <User2 className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium">{`${client.apellidos}, ${client.nombres}`}</p>
                          <p className="text-xs text-slate-500">ID: {client.idCliente}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-slate-500">DNI</p>
                          <p className="font-medium">{client.dni}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Teléfono</p>
                          <p className="font-medium">{client.telefono || client.movil || "N/A"}</p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p className="text-slate-500">Dirección</p>
                        <p className="font-medium">{client.direccion || "N/A"}</p>
                      </div>
                    </div>
                  )
                })()
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-slate-500">
                  <User2 className="h-8 w-8 mb-2 text-slate-300" />
                  <p>Ningún cliente seleccionado</p>
                  <p className="text-sm text-slate-400">Seleccione un cliente para el pedido</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
