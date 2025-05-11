"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Save, Package, DollarSign, Hash } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    descripcion: "",
    costo: "",
    precio: "",
    cantidad: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    const costo = Number.parseFloat(formData.costo)
    const precio = Number.parseFloat(formData.precio)
    const cantidad = Number.parseInt(formData.cantidad)

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
      setLoading(true)
      setError("")

      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion: formData.descripcion,
          costo,
          precio,
          cantidad,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Respuesta del servidor:", data)
        throw new Error(data.error || "Error al crear el producto")
      }

      toast({
        title: "Producto creado",
        description: `El producto ${data.descripcion} ha sido creado exitosamente`,
      })

      router.push("/dashboard/products")
    } catch (error) {
      console.error("Error adding product:", error)
      setError(error instanceof Error ? error.message : "Ocurrió un error al guardar el producto")
      setLoading(false)
    }
  }

  // Calculate profit margin
  const calculateMargin = () => {
    const costo = Number.parseFloat(formData.costo)
    const precio = Number.parseFloat(formData.precio)

    if (!isNaN(costo) && !isNaN(precio) && costo > 0) {
      const margin = ((precio - costo) / precio) * 100
      return margin.toFixed(2)
    }
    return "0.00"
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
              <BreadcrumbLink>Nuevo Producto</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Producto</h1>
            <p className="text-slate-500 mt-2">Añade un nuevo producto al inventario.</p>
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
            <CardDescription>Ingresa los datos del nuevo producto. Todos los campos son obligatorios.</CardDescription>
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
              <Button type="submit" disabled={loading} className="gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Guardar producto</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
              <CardDescription>Información calculada del producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-500">Margen de Ganancia</p>
                <p className="text-2xl font-bold mt-1">{calculateMargin()}%</p>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Costo:</span>
                    <span className="font-medium">${formData.costo || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Precio de Venta:</span>
                    <span className="font-medium">${formData.precio || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Ganancia por Unidad:</span>
                    <span className="font-medium">
                      $
                      {(Number.parseFloat(formData.precio || "0") - Number.parseFloat(formData.costo || "0")).toFixed(
                        2,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Valor Total en Stock:</span>
                    <span className="font-medium">
                      $
                      {(Number.parseFloat(formData.precio || "0") * Number.parseInt(formData.cantidad || "0")).toFixed(
                        2,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Consejos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Package className="h-3 w-3" />
                  </span>
                  <span>Usa descripciones claras y específicas para facilitar la búsqueda.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <DollarSign className="h-3 w-3" />
                  </span>
                  <span>Establece un margen de ganancia adecuado para tu negocio.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
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
