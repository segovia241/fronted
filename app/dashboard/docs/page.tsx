"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Users,
  Package,
  ClipboardList,
  Home,
  Search,
  Info,
  BookOpen,
  Lightbulb,
  Settings,
  BarChart3,
  Clock,
  Shield,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const sections = [
    {
      id: "intro",
      title: "Introducción",
      icon: Info,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            Bienvenido a la documentación del Sistema de Administración. Esta guía te ayudará a entender cómo utilizar
            todas las funcionalidades del sistema para gestionar clientes, productos y pedidos de manera eficiente.
          </p>
          <p className="text-slate-700">
            El sistema está diseñado para ser intuitivo y fácil de usar, con una interfaz moderna y responsive que
            funciona en dispositivos móviles y de escritorio.
          </p>
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Nota importante</AlertTitle>
            <AlertDescription className="text-blue-700">
              Para acceder al sistema, utiliza las credenciales proporcionadas por el administrador. Las credenciales
              predeterminadas son: Usuario: <strong>admin</strong>, Contraseña: <strong>admin</strong>
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      id: "dashboard",
      title: "Dashboard",
      icon: Home,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            El Dashboard es la página principal del sistema y proporciona una visión general de la información más
            importante:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Estadísticas clave: número de clientes, productos, pedidos y ventas totales.</li>
            <li>Pedidos recientes: los últimos pedidos realizados en el sistema.</li>
            <li>Acciones rápidas: accesos directos a las funciones más utilizadas.</li>
            <li>Resumen del sistema: información general sobre las funcionalidades disponibles.</li>
          </ul>
          <p className="text-slate-700">
            Desde el Dashboard puedes navegar a cualquier sección del sistema utilizando el menú lateral o los accesos
            rápidos.
          </p>
          <Alert className="bg-emerald-50 border-emerald-200">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800">Análisis de datos</AlertTitle>
            <AlertDescription className="text-emerald-700">
              El Dashboard incluye gráficos interactivos que te permiten visualizar tendencias de ventas, productos más
              vendidos y actividad de clientes.
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      id: "clients",
      title: "Gestión de Clientes",
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            La sección de Clientes te permite gestionar toda la información relacionada con tus clientes:
          </p>
          <h4 className="text-lg font-medium text-slate-900">Listar Clientes</h4>
          <p className="text-slate-700">
            En esta vista puedes ver todos los clientes registrados en el sistema. Puedes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Buscar clientes por nombre, apellido o DNI.</li>
            <li>Ver la información detallada de cada cliente.</li>
            <li>Navegar entre páginas si tienes muchos clientes.</li>
            <li>Cambiar entre vista de lista y vista de tarjetas.</li>
            <li>Editar la información de los clientes existentes.</li>
            <li>Eliminar clientes del sistema (con confirmación).</li>
          </ul>

          <h4 className="text-lg font-medium text-slate-900">Nuevo Cliente</h4>
          <p className="text-slate-700">
            Para añadir un nuevo cliente, haz clic en el botón "Nuevo Cliente" y completa el formulario con la siguiente
            información:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Apellidos*:</strong> Apellidos del cliente (obligatorio).
            </li>
            <li>
              <strong>Nombres*:</strong> Nombres del cliente (obligatorio).
            </li>
            <li>
              <strong>Dirección:</strong> Dirección completa del cliente.
            </li>
            <li>
              <strong>DNI*:</strong> Documento de identidad del cliente (obligatorio).
            </li>
            <li>
              <strong>Teléfono:</strong> Número de teléfono fijo.
            </li>
            <li>
              <strong>Móvil:</strong> Número de teléfono móvil.
            </li>
          </ul>
          <p className="text-slate-700">
            Una vez completado el formulario, haz clic en "Guardar cliente" para registrar al cliente en el sistema.
          </p>

          <h4 className="text-lg font-medium text-slate-900">Editar Cliente</h4>
          <p className="text-slate-700">
            Para editar un cliente existente, haz clic en el botón de edición junto al cliente en la lista. Podrás
            modificar todos sus datos y guardar los cambios.
          </p>
        </div>
      ),
    },
    {
      id: "products",
      title: "Gestión de Productos",
      icon: Package,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">La sección de Productos te permite gestionar tu inventario de productos:</p>
          <h4 className="text-lg font-medium text-slate-900">Listar Productos</h4>
          <p className="text-slate-700">
            En esta vista puedes ver todos los productos registrados en el sistema. Puedes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Buscar productos por descripción.</li>
            <li>Ver información detallada de cada producto: descripción, costo, precio, cantidad en stock y estado.</li>
            <li>Identificar rápidamente productos con stock bajo gracias a los indicadores visuales.</li>
            <li>Ver estadísticas generales como el valor total del inventario.</li>
            <li>Editar productos existentes.</li>
            <li>Eliminar productos del inventario (con confirmación).</li>
          </ul>

          <h4 className="text-lg font-medium text-slate-900">Nuevo Producto</h4>
          <p className="text-slate-700">
            Para añadir un nuevo producto, haz clic en el botón "Nuevo Producto" y completa el formulario con la
            siguiente información:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <strong>Descripción*:</strong> Nombre o descripción del producto (obligatorio).
            </li>
            <li>
              <strong>Costo*:</strong> Costo de adquisición del producto (obligatorio).
            </li>
            <li>
              <strong>Precio de Venta*:</strong> Precio al que se venderá el producto (obligatorio).
            </li>
            <li>
              <strong>Cantidad en Stock*:</strong> Número de unidades disponibles (obligatorio).
            </li>
          </ul>
          <p className="text-slate-700">
            El sistema calculará automáticamente el margen de ganancia y otros valores relevantes. Una vez completado el
            formulario, haz clic en "Guardar producto" para registrarlo en el sistema.
          </p>

          <h4 className="text-lg font-medium text-slate-900">Estados de Stock</h4>
          <p className="text-slate-700">El sistema utiliza indicadores visuales para mostrar el estado del stock:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>
              <span className="inline-block px-2 py-1 bg-red-200 text-red-900 rounded-md text-xs font-medium">
                Sin stock
              </span>{" "}
              - No hay unidades disponibles
            </li>
            <li>
              <span className="inline-block px-2 py-1 bg-amber-200 text-amber-900 rounded-md text-xs font-medium">
                Stock bajo
              </span>{" "}
              - Menos de 5 unidades
            </li>
            <li>
              <span className="inline-block px-2 py-1 bg-blue-200 text-blue-900 rounded-md text-xs font-medium">
                Stock medio
              </span>{" "}
              - Entre 5 y 9 unidades
            </li>
            <li>
              <span className="inline-block px-2 py-1 bg-emerald-200 text-emerald-900 rounded-md text-xs font-medium">
                En stock
              </span>{" "}
              - 10 o más unidades
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "orders",
      title: "Gestión de Pedidos",
      icon: ClipboardList,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">La sección de Pedidos te permite gestionar los pedidos de tus clientes:</p>
          <h4 className="text-lg font-medium text-slate-900">Listar Pedidos</h4>
          <p className="text-slate-700">
            En esta vista puedes ver todos los pedidos registrados en el sistema. Puedes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Buscar pedidos por cliente o número de pedido.</li>
            <li>Ver información detallada de cada pedido: cliente, fecha, subtotal y total.</li>
            <li>Ver estadísticas generales como ventas totales y valor promedio de pedidos.</li>
            <li>Ver detalles completos de un pedido específico.</li>
            <li>Editar pedidos existentes.</li>
            <li>Eliminar pedidos (con confirmación).</li>
          </ul>

          <h4 className="text-lg font-medium text-slate-900">Nuevo Pedido</h4>
          <p className="text-slate-700">
            Para crear un nuevo pedido, haz clic en el botón "Nuevo Pedido" y sigue estos pasos:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-slate-700">
            <li>Selecciona un cliente de la lista desplegable.</li>
            <li>Verifica o modifica la fecha del pedido.</li>
            <li>
              Añade productos al pedido:
              <ul className="list-disc pl-6 mt-2 text-slate-700">
                <li>Selecciona un producto de la lista desplegable.</li>
                <li>Indica la cantidad deseada.</li>
                <li>Haz clic en "Agregar" para añadir el producto al pedido.</li>
                <li>Repite este proceso para añadir más productos.</li>
              </ul>
            </li>
            <li>Revisa el resumen del pedido que muestra el total calculado.</li>
            <li>Haz clic en "Guardar pedido" para registrarlo en el sistema.</li>
          </ol>
          <p className="text-slate-700">
            El sistema verificará automáticamente la disponibilidad de stock y calculará los totales. Si un producto no
            tiene suficiente stock, se mostrará un mensaje de error.
          </p>

          <h4 className="text-lg font-medium text-slate-900">Ver Detalles del Pedido</h4>
          <p className="text-slate-700">
            Al hacer clic en el botón de ver detalles, podrás acceder a toda la información del pedido, incluyendo:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Información del cliente</li>
            <li>Fecha y hora del pedido</li>
            <li>Lista completa de productos con cantidades y precios</li>
            <li>Subtotal, impuestos y total</li>
            <li>Opciones para imprimir o exportar el pedido</li>
          </ul>
        </div>
      ),
    },
    {
      id: "security",
      title: "Seguridad y Sesiones",
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            El sistema cuenta con características de seguridad para proteger la información:
          </p>

          <h4 className="text-lg font-medium text-slate-900">Control de Sesiones</h4>
          <p className="text-slate-700">
            El sistema gestiona automáticamente las sesiones de usuario para garantizar la seguridad:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Cierre de sesión automático por inactividad</li>
            <li>Indicador visual del estado de actividad</li>
            <li>Advertencia previa al cierre de sesión automático</li>
            <li>Reinicio del temporizador al detectar actividad del usuario</li>
          </ul>

          <h4 className="text-lg font-medium text-slate-900">Temporizador de Inactividad</h4>
          <p className="text-slate-700">El sistema incluye un temporizador de inactividad que:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Muestra el tiempo restante antes del cierre de sesión</li>
            <li>Cambia de color según el tiempo restante (verde, amarillo, rojo)</li>
            <li>Muestra una alerta cuando quedan pocos segundos</li>
            <li>Cierra la sesión automáticamente cuando el tiempo llega a cero</li>
          </ul>

          <Alert className="bg-amber-50 border-amber-200">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Tiempo de inactividad</AlertTitle>
            <AlertDescription className="text-amber-700">
              Por defecto, el sistema cerrará tu sesión después de 5 minutos de inactividad. Recibirás una advertencia
              15 segundos antes del cierre.
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
    {
      id: "settings",
      title: "Configuración del Sistema",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            La sección de configuración te permite personalizar varios aspectos del sistema:
          </p>

          <h4 className="text-lg font-medium text-slate-900">Preferencias de Usuario</h4>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Cambiar contraseña</li>
            <li>Actualizar información de perfil</li>
            <li>Configurar notificaciones</li>
          </ul>

          <h4 className="text-lg font-medium text-slate-900">Configuración General</h4>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Información de la empresa</li>
            <li>Configuración de impuestos</li>
            <li>Opciones de visualización</li>
            <li>Tiempo de inactividad para cierre de sesión</li>
          </ul>

          <h4 className="text-lg font-medium text-slate-900">Gestión de Usuarios</h4>
          <p className="text-slate-700">Los administradores pueden gestionar los usuarios del sistema:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Crear nuevos usuarios</li>
            <li>Asignar roles y permisos</li>
            <li>Desactivar cuentas</li>
            <li>Restablecer contraseñas</li>
          </ul>
        </div>
      ),
    },
    {
      id: "tips",
      title: "Consejos y Mejores Prácticas",
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">Aquí encontrarás algunos consejos para aprovechar al máximo el sistema:</p>
          <h4 className="text-lg font-medium text-slate-900">Gestión de Clientes</h4>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Mantén actualizada la información de contacto de tus clientes.</li>
            <li>Utiliza el campo DNI para identificar de manera única a cada cliente.</li>
            <li>Aprovecha la búsqueda para encontrar rápidamente a un cliente específico.</li>
            <li>Utiliza la vista de tarjetas para una visualización más gráfica de tus clientes.</li>
          </ul>

          <h4 className="text-lg font-medium text-slate-900">Gestión de Productos</h4>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Utiliza descripciones claras y específicas para facilitar la búsqueda.</li>
            <li>Mantén actualizado el stock para evitar problemas al crear pedidos.</li>
            <li>Revisa periódicamente los productos con stock bajo para reabastecerlos.</li>
            <li>Establece un margen de ganancia adecuado para tu negocio.</li>
            <li>
              Utiliza los indicadores de estado de stock para identificar rápidamente productos que necesitan atención.
            </li>
          </ul>

          <h4 className="text-lg font-medium text-slate-900">Gestión de Pedidos</h4>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Verifica siempre la información del cliente antes de crear un pedido.</li>
            <li>Revisa el resumen del pedido antes de guardarlo para asegurarte de que todo es correcto.</li>
            <li>Utiliza la fecha correcta para mantener un registro preciso de los pedidos.</li>
            <li>Aprovecha la función de búsqueda para encontrar pedidos específicos.</li>
          </ul>

          <h4 className="text-lg font-medium text-slate-900">Seguridad</h4>
          <ul className="list-disc pl-6 space-y-2 text-slate-700">
            <li>Cierra sesión manualmente cuando no estés utilizando el sistema.</li>
            <li>Cambia tu contraseña regularmente.</li>
            <li>No compartas tus credenciales con otros usuarios.</li>
            <li>Presta atención a las advertencias de cierre de sesión por inactividad.</li>
          </ul>

          <Alert className="bg-emerald-50 border-emerald-200 mt-4">
            <Lightbulb className="h-4 w-4 text-emerald-600" />
            <AlertTitle className="text-emerald-800">Consejo Pro</AlertTitle>
            <AlertDescription className="text-emerald-700">
              Utiliza el Dashboard para obtener una visión rápida del estado de tu negocio. Las estadísticas te ayudarán
              a tomar decisiones informadas sobre tu inventario y ventas.
            </AlertDescription>
          </Alert>
        </div>
      ),
    },
  ]

  // Filter sections based on search term
  const filteredSections = sections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.props.children.some(
        (child: { props: { children: string } }) =>
          typeof child === "object" &&
          child.props &&
          child.props.children &&
          (typeof child.props.children === "string"
            ? child.props.children.toLowerCase().includes(searchTerm.toLowerCase())
            : JSON.stringify(child.props.children).toLowerCase().includes(searchTerm.toLowerCase())),
      ),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Documentación</h1>
        <p className="text-slate-600 mt-2">Guía completa del Sistema de Administración.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="border border-gray-200 shadow-sm md:w-64 lg:w-80">
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Buscar en la documentación..."
                className="pl-9 border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1 px-4 pb-4">
              {filteredSections.map((section) => (
                <Button
                  key={section.id}
                  variant="ghost"
                  className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  onClick={() => {
                    const element = document.getElementById(section.id)
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  <section.icon className="mr-2 h-4 w-4" />
                  {section.title}
                </Button>
              ))}
            </nav>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center border-b pb-4">
              <BookOpen className="h-5 w-5 mr-2 text-[#48bf84]" />
              <CardTitle>Manual del Usuario</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {filteredSections.length > 0 ? (
                <div className="space-y-8">
                  {filteredSections.map((section) => (
                    <div key={section.id} id={section.id} className="scroll-mt-16">
                      <div className="flex items-center mb-4">
                        <section.icon className="h-5 w-5 mr-2 text-[#48bf84]" />
                        <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                      </div>
                      <div className="pl-7">{section.content}</div>
                      {section !== filteredSections[filteredSections.length - 1] && <Separator className="mt-8" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <FileText className="h-12 w-12 mb-4 text-slate-300" />
                  <p className="text-lg font-medium">No se encontraron resultados</p>
                  <p className="text-slate-400 mt-1">Intenta con otra búsqueda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
