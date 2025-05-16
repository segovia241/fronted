"use client"

import type React from "react"
import { use } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Save, User, MapPin, Phone, Smartphone, BadgeIcon as IdCard, Loader2 } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/components/ui/use-toast"
import { getCliente, updateCliente, type Cliente } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditClientPage({ params }: { params: { id: string } }) {
  // Usar React.use para desenvolver params.id
  const id = use(params).id

  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<Cliente>({
    idCliente: "",
    apellidos: "",
    nombres: "",
    direccion: "",
    dni: "",
    telefono: "",
    movil: "",
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await getCliente(id)
        if (client) {
          setFormData(client)
        } else {
          setError("Cliente no encontrado")
        }
      } catch (error) {
        console.error("Error fetching client:", error)
        setError("Error al cargar los datos del cliente")
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
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
    if (!formData.apellidos || !formData.nombres || !formData.dni) {
      setError("Por favor complete los campos obligatorios: Apellidos, Nombres y DNI")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      // Usar la función updateCliente de lib/data.ts
      const clienteData = {
        apellidos: formData.apellidos,
        nombres: formData.nombres,
        direccion: formData.direccion,
        dni: formData.dni,
        telefono: formData.telefono,
        movil: formData.movil,
      }

      const updatedClient = await updateCliente(id, clienteData)

      if (!updatedClient) {
        throw new Error("Error al actualizar el cliente")
      }

      toast({
        title: "Cliente actualizado",
        description: `El cliente ${updatedClient.apellidos}, ${updatedClient.nombres} ha sido actualizado exitosamente`,
      })

      router.push("/dashboard/clients")
    } catch (error: any) {
      console.error("Error updating client:", error)
      setError(error.message || "Ocurrió un error al actualizar el cliente")
    } finally {
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
                <BreadcrumbLink href="/dashboard/clients">Clientes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>Editar Cliente</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Editar Cliente</h1>
              <p className="text-slate-500 mt-2">Cargando datos del cliente...</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/dashboard/clients")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
            <CardDescription>Cargando datos...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
            </div>
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
              <BreadcrumbLink href="/dashboard/clients">Clientes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Editar Cliente</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Cliente</h1>
            <p className="text-slate-500 mt-2">Actualiza la información del cliente.</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/dashboard/clients")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
          <CardTitle>Información del Cliente</CardTitle>
          <CardDescription>
            Actualiza los datos del cliente. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md animate-appear">
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="apellidos" className="text-sm font-medium">
                  Apellidos *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Ingrese los apellidos"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombres" className="text-sm font-medium">
                  Nombres *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="nombres"
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Ingrese los nombres"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-sm font-medium">
                Dirección
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="Ingrese la dirección completa"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dni" className="text-sm font-medium">
                  DNI *
                </Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Ingrese el DNI"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-sm font-medium">
                  Teléfono
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Ingrese el teléfono fijo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="movil" className="text-sm font-medium">
                  Móvil
                </Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="movil"
                    name="movil"
                    value={formData.movil}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Ingrese el teléfono móvil"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/clients")}>
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
    </div>
  )
}
