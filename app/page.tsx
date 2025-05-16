"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Lock, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { login } from "@/lib/data"

export default function LoginPage() {
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (isAuthenticated === "true") {
      router.push("/dashboard")
    }
  }, [])

  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    idUsuario: "",
    passwd: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simple validation
    if (!formData.idUsuario || !formData.passwd) {
      setError("Por favor complete todos los campos")
      setLoading(false)
      return
    }

    try {
      const result = await login(formData)

      if (!result.success) {
        throw new Error(result.error || "Error en la autenticación")
      }

      // Guardar información de autenticación
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", result.user?.idUsuario || "")
      localStorage.setItem("userToken", result.token || "")
      localStorage.setItem("userName", result.user?.nombre || "")
      localStorage.setItem("userRole", result.user?.rol || "")

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido, ${result.user?.nombre || result.user?.idUsuario}`,
      })

      // Redireccionar al dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error de autenticación:", error)
      setError(error instanceof Error ? error.message : "Usuario o contraseña incorrectos")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 to-primary/20 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary mb-4">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Sistema de Administración</h1>
          <p className="text-muted-foreground mt-2">Acceda a su cuenta para continuar</p>
        </div>

        <Card className="w-full shadow-lg border-0 glass-effect">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">Ingrese sus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-4 rounded-md animate-appear">
                  <p>{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="idUsuario" className="text-sm font-medium">
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="idUsuario"
                    name="idUsuario"
                    placeholder="Ingrese su usuario"
                    value={formData.idUsuario}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwd" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passwd"
                    name="passwd"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={formData.passwd}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-gradient-primary" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © {new Date().getFullYear()} Sistema de Administración. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
