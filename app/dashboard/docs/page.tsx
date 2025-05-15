"use client"

import { useState } from "react"
import { FileText, Search, Code, Database, Users, ShoppingCart, Package, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const endpoints = [
    {
      method: "GET",
      path: "/api/clientes",
      description: "Obtiene todos los clientes",
      category: "clientes",
      response: `[
  {
    "id": 1,
    "nombre": "Cliente Ejemplo",
    "email": "cliente@ejemplo.com",
    "telefono": "123456789",
    "direccion": "Calle Ejemplo 123",
    "tipo": "empresa"
  },
  ...
]`,
    },
    {
      method: "GET",
      path: "/api/clientes/:id",
      description: "Obtiene un cliente por ID",
      category: "clientes",
      response: `{
  "id": 1,
  "nombre": "Cliente Ejemplo",
  "email": "cliente@ejemplo.com",
  "telefono": "123456789",
  "direccion": "Calle Ejemplo 123",
  "tipo": "empresa"
}`,
    },
    {
      method: "POST",
      path: "/api/clientes",
      description: "Crea un nuevo cliente",
      category: "clientes",
      request: `{
  "nombre": "Nuevo Cliente",
  "email": "nuevo@cliente.com",
  "telefono": "987654321",
  "direccion": "Calle Nueva 456",
  "tipo": "individual"
}`,
      response: `{
  "id": 2,
  "nombre": "Nuevo Cliente",
  "email": "nuevo@cliente.com",
  "telefono": "987654321",
  "direccion": "Calle Nueva 456",
  "tipo": "individual"
}`,
    },
    {
      method: "PUT",
      path: "/api/clientes/:id",
      description: "Actualiza un cliente existente",
      category: "clientes",
      request: `{
  "nombre": "Cliente Actualizado",
  "email": "actualizado@cliente.com",
  "telefono": "555555555",
  "direccion": "Calle Actualizada 789",
  "tipo": "empresa"
}`,
      response: `{
  "id": 1,
  "nombre": "Cliente Actualizado",
  "email": "actualizado@cliente.com",
  "telefono": "555555555",
  "direccion": "Calle Actualizada 789",
  "tipo": "empresa"
}`,
    },
    {
      method: "DELETE",
      path: "/api/clientes/:id",
      description: "Elimina un cliente",
      category: "clientes",
      response: `{
  "message": "Cliente eliminado correctamente"
}`,
    },
    {
      method: "GET",
      path: "/api/productos",
      description: "Obtiene todos los productos",
      category: "productos",
      response: `[
  {
    "id": 1,
    "nombre": "Producto Ejemplo",
    "descripcion": "Descripción del producto",
    "precio": 19.99,
    "stock": 100
  },
  ...
]`,
    },
    {
      method: "GET",
      path: "/api/productos/:id",
      description: "Obtiene un producto por ID",
      category: "productos",
      response: `{
  "id": 1,
  "nombre": "Producto Ejemplo",
  "descripcion": "Descripción del producto",
  "precio": 19.99,
  "stock": 100
}`,
    },
    {
      method: "POST",
      path: "/api/productos",
      description: "Crea un nuevo producto",
      category: "productos",
      request: `{
  "nombre": "Nuevo Producto",
  "descripcion": "Descripción del nuevo producto",
  "precio": 29.99,
  "stock": 50
}`,
      response: `{
  "id": 2,
  "nombre": "Nuevo Producto",
  "descripcion": "Descripción del nuevo producto",
  "precio": 29.99,
  "stock": 50
}`,
    },
    {
      method: "PUT",
      path: "/api/productos/:id",
      description: "Actualiza un producto existente",
      category: "productos",
      request: `{
  "nombre": "Producto Actualizado",
  "descripcion": "Descripción actualizada",
  "precio": 39.99,
  "stock": 75
}`,
      response: `{
  "id": 1,
  "nombre": "Producto Actualizado",
  "descripcion": "Descripción actualizada",
  "precio": 39.99,
  "stock": 75
}`,
    },
    {
      method: "DELETE",
      path: "/api/productos/:id",
      description: "Elimina un producto",
      category: "productos",
      response: `{
  "message": "Producto eliminado correctamente"
}`,
    },
    {
      method: "GET",
      path: "/api/pedidos",
      description: "Obtiene todos los pedidos",
      category: "pedidos",
      response: `[
  {
    "id": 1,
    "fecha": "2023-01-01T12:00:00Z",
    "estado": "pendiente",
    "total": 59.97,
    "cliente_id": 1,
    "cliente_nombre": "Cliente Ejemplo"
  },
  ...
]`,
    },
    {
      method: "GET",
      path: "/api/pedidos/:id",
      description: "Obtiene un pedido por ID",
      category: "pedidos",
      response: `{
  "id": 1,
  "fecha": "2023-01-01T12:00:00Z",
  "estado": "pendiente",
  "total": 59.97,
  "cliente_id": 1,
  "cliente_nombre": "Cliente Ejemplo",
  "detalles": [
    {
      "id": 1,
      "pedido_id": 1,
      "producto_id": 1,
      "producto_nombre": "Producto Ejemplo",
      "cantidad": 3,
      "precio_unitario": 19.99
    }
  ]
}`,
    },
    {
      method: "POST",
      path: "/api/pedidos",
      description: "Crea un nuevo pedido",
      category: "pedidos",
      request: `{
  "cliente_id": 1,
  "estado": "pendiente",
  "detalles": [
    {
      "producto_id": 1,
      "cantidad": 3
    }
  ]
}`,
      response: `{
  "id": 2,
  "fecha": "2023-01-02T12:00:00Z",
  "estado": "pendiente",
  "total": 59.97,
  "cliente_id": 1,
  "cliente_nombre": "Cliente Ejemplo"
}`,
    },
    {
      method: "PUT",
      path: "/api/pedidos/:id",
      description: "Actualiza un pedido existente",
      category: "pedidos",
      request: `{
  "estado": "entregado"
}`,
      response: `{
  "id": 1,
  "fecha": "2023-01-01T12:00:00Z",
  "estado": "entregado",
  "total": 59.97,
  "cliente_id": 1,
  "cliente_nombre": "Cliente Ejemplo"
}`,
    },
    {
      method: "DELETE",
      path: "/api/pedidos/:id",
      description: "Elimina un pedido",
      category: "pedidos",
      response: `{
  "message": "Pedido eliminado correctamente"
}`,
    },
    {
      method: "GET",
      path: "/api/detalles/:id",
      description: "Obtiene los detalles de un pedido por ID de pedido",
      category: "detalles",
      response: `[
  {
    "id": 1,
    "pedido_id": 1,
    "producto_id": 1,
    "producto_nombre": "Producto Ejemplo",
    "cantidad": 3,
    "precio_unitario": 19.99
  },
  ...
]`,
    },
    {
      method: "POST",
      path: "/api/detalle-pedidos",
      description: "Crea un nuevo detalle de pedido",
      category: "detalles",
      request: `{
  "pedido_id": 1,
  "producto_id": 2,
  "cantidad": 1
}`,
      response: `{
  "id": 2,
  "pedido_id": 1,
  "producto_id": 2,
  "producto_nombre": "Nuevo Producto",
  "cantidad": 1,
  "precio_unitario": 29.99
}`,
    },
    {
      method: "POST",
      path: "/api/auth",
      description: "Autentica a un usuario",
      category: "autenticacion",
      request: `{
  "username": "admin",
  "password": "password"
}`,
      response: `{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}`,
    },
    {
      method: "POST",
      path: "/api/usuarios",
      description: "Crea un nuevo usuario",
      category: "usuarios",
      request: `{
  "username": "nuevo_usuario",
  "password": "contraseña",
  "role": "user"
}`,
      response: `{
  "id": 2,
  "username": "nuevo_usuario",
  "role": "user"
}`,
    },
    {
      method: "POST",
      path: "/api/document",
      description: "Genera un documento PDF para un pedido",
      category: "documentos",
      request: `{
  "pedido_id": 1
}`,
      response: `{
  "url": "/documents/pedido_1.pdf"
}`,
    },
  ];

  const filteredEndpoints = endpoints.filter(
    (endpoint) =>
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "POST":
        return "bg-green-100 text-green-800 border-green-200";
      case "PUT":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "clientes":
        return <Users className="h-5 w-5" />;
      case "productos":
        return <Package className="h-5 w-5" />;
      case "pedidos":
        return <ShoppingCart className="h-5 w-5" />;
      case "detalles":
        return <FileText className="h-5 w-5" />;
      case "autenticacion":
        return <Settings className="h-5 w-5" />;
      case "usuarios":
        return <Users className="h-5 w-5" />;
      case "documentos":
        return <FileText className="h-5 w-5" />;
      default:
        return <Code className="h-5 w-5" />;
    }
  };

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
    toast({
      title: "Copiado al portapapeles",
      description: "El endpoint ha sido copiado correctamente",
    });
  };

  const categories = [
    { id: "all", name: "Todos", icon: <Database className="h-4 w-4" /> },
    { id: "clientes", name: "Clientes", icon: <Users className="h-4 w-4" /> },
    { id: "productos", name: "Productos", icon: <Package className="h-4 w-4" /> },
    { id: "pedidos", name: "Pedidos", icon: <ShoppingCart className="h-4 w-4" /> },
    { id: "detalles", name: "Detalles", icon: <FileText className="h-4 w-4" /> },
    { id: "autenticacion", name: "Autenticación", icon: <Settings className="h-4 w-4" /> },
    { id: "usuarios", name: "Usuarios", icon: <Users className="h-4 w-4" /> },
    { id: "documentos", name: "Documentos", icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-gray-900">
          <FileText className="h-8 w-8" />
          Documentación API
        </h1>
      </div>

      <Card className="overflow-hidden border border-gray-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-slate-800">Referencia de API</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar endpoints..."
                className="pl-8 bg-white border-gray-300 focus:border-slate-500 focus:ring focus:ring-slate-200 focus:ring-opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 overflow-x-auto">
              <TabsList className="bg-transparent p-0 h-auto flex space-x-2">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all"
                  >
                    {category.icon}
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {categories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="p-0 mt-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <div className="divide-y divide-gray-200">
                  {filteredEndpoints
                    .filter(
                      (endpoint) =>
                        category.id === "all" || endpoint.category === category.id
                    )
                    .map((endpoint, index) => (
                      <Accordion
                        key={`${endpoint.method}-${endpoint.path}-${index}`}
                        type="single"
                        collapsible
                        className="w-full"
                      >
                        <AccordionItem value={`item-${index}`}\
