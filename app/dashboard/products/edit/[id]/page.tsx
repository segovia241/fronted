"use client"

import type React from "react"
import { use } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Save, Package, DollarSign, Hash, Loader2 } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { getProducto, updateProducto, type Producto } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditProductPage({ params }: { params: { id: string } }) {
  // Usar React.use para desenvolver params.id
  const id = use(params).id

  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<Producto>({
    idProducto: "",
    descripcion: "",
    costo: 0,
    precio: 0,
    cantidad: 0,
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await getProducto(id)
        if (product) {
          setFormData(product)
        } else {
          setError("Producto no encontrado")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Error al cargar los datos del producto")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    if (!formData.descripcion) {
      setError("Por favor ingrese la descripción del producto")
      return
    }

    // Validate numeric fields
    const costo = Number.parseFloat(formData.costo.toString())
    const precio = Number.parseFloat(formData.precio.toString())
    const cantidad = Number.parseInt(formData.cantidad.toString())

    if (isNaN(costo) || costo < 0) {
      setError("El costo debe ser un número válido mayor o igual a 0")
      return
    }

    if (isNaN(precio) || precio < 0) {
      setError("El precio debe ser un número válido mayor o igual a 0")
      return
    }

    if (isNaN(cantidad) || cantidad < 0) {
      setError("La cantidad debe ser un número entero válido mayor o igual a 0")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      // Usar la función updateProducto de lib/data.ts
      const productoData = {
        descripcion: formData.descripcion,
        costo,
        precio,
        cantidad,
      }

      const updatedProduct = await updateProducto(id, productoData)

      if (!updatedProduct) {
        throw new Error("Error al actualizar el producto")
      }

      toast({
        title: "Producto actualizado",
        description: `El producto ${updatedProduct.descripcion} ha sido actualizado exitosamente`,
      })

      router.push("/dashboard/products")
    } catch (error: any) {
      console.error("Error updating product:", error)
      setError(error.message || "Ocurrió un error al actualizar el producto")
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate profit margin
  const calculateMargin = () => {
    const costo = Number(formData.costo)
    const precio = Number(formData.precio)

    if (!isNaN(costo) && !isNaN(precio) && costo > 0) {
      const margin = ((precio - costo) / precio) * 100
      return margin.toFixed(2)
    }
    return "0.00"
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
                <BreadcrumbLink href="/dashboard/products">Productos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Editar Producto</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
              <p className="text-slate-500 mt-2">Cargando datos del producto...</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard/products")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
              <CardDescription>Cargando datos...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
                <CardDescription>Información calculada del producto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-8 w-20 mt-2" />
                  <Skeleton className="h-[1px] w-full my-4" />
                  <div className="space-y-2">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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
              <BreadcrumbLink href="/dashboard/products">Productos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Editar Producto</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Producto</h1>
            <p className="text-slate-500 mt-2">Actualiza la información del producto.</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm lg:col-span-2 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle>Información del Producto</CardTitle>
            <CardDescription>Actualiza los datos del producto. Todos los campos son obligatorios.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-appear">
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="descripcion" className="text-sm font-medium">
                  Descripción *
                </Label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Ingrese la descripción del producto"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="costo" className="text-sm font-medium">
                    Costo *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="costo"
                      name="costo"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.costo}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precio" className="text-sm font-medium">
                    Precio de Venta *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="precio"
                      name="precio"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.precio}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cantidad" className="text-sm font-medium">
                    Cantidad en Stock *
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="cantidad"
                      name="cantidad"
                      type="number"
                      min="0"
                      value={formData.cantidad}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/products")}>
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
              <CardTitle>Resumen</CardTitle>
              <CardDescription>Información calculada del producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Margen de Ganancia</p>
                <p className="text-2xl font-bold mt-1 text-indigo-600">{calculateMargin()}%</p>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Costo:</span>
                    <span className="font-medium">${Number(formData.costo).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Precio de Venta:</span>
                    <span className="font-medium">${Number(formData.precio).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Ganancia por Unidad:</span>
                    <span className="font-medium">
                      ${(Number(formData.precio) - Number(formData.costo)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Valor Total en Stock:</span>
                    <span className="font-medium">
                      ${(Number(formData.precio) * Number(formData.cantidad)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle>Consejos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                    <Package className="h-3 w-3" />
                  </span>
                  <span>Usa descripciones claras y específicas para facilitar la búsqueda.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                    <DollarSign className="h-3 w-3" />
                  </span>
                  <span>Establece un margen de ganancia adecuado para tu negocio.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-100 text-indigo-600 rounded-full p-1 mr-2 mt-0.5">
                    <Hash className="h-3 w-3" />
                  </span>
                  <span>Mantén actualizado el stock para evitar problemas de inventario.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
