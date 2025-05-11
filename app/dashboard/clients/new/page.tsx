"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Save, User, MapPin, Phone, Smartphone, BadgeIcon as IdCard, Search } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useToast } from "@/components/ui/use-toast"
import { createCliente } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewClientPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    apellidos: "",
    nombres: "",
    direccion: "",
    dni: "",
    telefono: "",
    movil: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [documentType, setDocumentType] = useState("dni")
  const [documentNumber, setDocumentNumber] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)

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
      setLoading(true)
      setError("")

      const cliente = await createCliente(formData)

      if (cliente) {
        toast({
          title: "Cliente creado",
          description: `El cliente ${cliente.apellidos}, ${cliente.nombres} ha sido creado exitosamente`,
        })
        router.push("/dashboard/clients")
      }
    } catch (error: any) {
      console.error("Error adding client:", error)
      setError(error.message || "Ocurrió un error al guardar el cliente")
      setLoading(false)
    }
  }

  const searchDocument = async () => {
    if (!documentNumber) {
      toast({
        title: "Error",
        description: "Por favor ingrese un número de documento",
        variant: "destructive",
      })
      return
    }

    try {
      setSearchLoading(true)
      setError("")

      // Llamamos a nuestra API interna en lugar de directamente a la API externa
      const response = await fetch(`/api/document?type=${documentType}&number=${documentNumber}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error al consultar el ${documentType.toUpperCase()}`)
      }

      const data = await response.json()

      if (documentType === "dni") {
        // Actualizar formulario con datos de DNI
        setFormData({
          ...formData,
          nombres: data.nombres || "",
          apellidos: `${data.apellidoPaterno || ""} ${data.apellidoMaterno || ""}`.trim(),
          dni: data.numeroDocumento || "",
        })

        toast({
          title: "Datos encontrados",
          description: `Se han cargado los datos de ${data.nombreCompleto}`,
        })
      } else {
        // Actualizar formulario con datos de RUC
        setFormData({
          ...formData,
          nombres: data.razonSocial || "",
          apellidos: "",
          direccion: data.direccion || "",
          dni: data.numeroDocumento || "",
        })

        toast({
          title: "Datos encontrados",
          description: `Se han cargado los datos de ${data.razonSocial}`,
        })
      }
    } catch (error: any) {
      console.error("Error searching document:", error)
      toast({
        title: "Error",
        description: error.message || `No se pudo obtener información del ${documentType.toUpperCase()}`,
        variant: "destructive",
      })
    } finally {
      setSearchLoading(false)
    }
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
              <BreadcrumbLink>Nuevo Cliente</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h1>
            <p className="text-slate-500 mt-2">Añade un nuevo cliente al sistema.</p>
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
          <CardDescription>
            Ingresa los datos del nuevo cliente. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>

        {/* Sección de autocompletado */}
        <CardContent className="border-b pb-6">
          <div className="space-y-4">
            <h3 className="font-medium">Autocompletar datos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="documentType">Tipo de documento</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dni">DNI</SelectItem>
                    <SelectItem value="ruc">RUC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="documentNumber">Número de documento</Label>
                <Input
                  id="documentNumber"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder={documentType === "dni" ? "Ingrese DNI" : "Ingrese RUC"}
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={searchDocument}
                  disabled={searchLoading || !documentNumber}
                  className="gap-2 w-full"
                >
                  {searchLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Buscando...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      <span>Buscar</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

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
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Guardar cliente</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
