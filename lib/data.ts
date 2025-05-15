// Interfaces para los tipos de datos que coinciden con la API

// Cliente
export interface Cliente {
  idCliente: string
  apellidos: string
  nombres: string
  direccion: string
  dni: string
  telefono: string
  movil: string
}

// Producto
export interface Producto {
  idProducto: string
  descripcion: string
  costo: number
  precio: number
  cantidad: number
}

// Detalle de Pedido
export interface DetallePedido {
  idPedido: string
  idProd: string
  cantidad: number
  precio: number
  totalDeta: number
}

// Pedido
export interface Pedido {
  idPedido: string
  cliente: {
    idCliente: string
    apellidos?: string
    nombres?: string
  }
  fecha: string
  subTotal: number
  totalVenta: number
}

// Usuario
export interface Usuario {
  idUsuario: string
  passwd?: string
  nombre?: string
  rol?: string
}

// Modificar la función getApiBaseUrl para asegurar que incluya el protocolo
export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""

  // Verificar si la URL ya incluye el protocolo
  if (baseUrl && !baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    // Añadir http:// por defecto si no tiene protocolo
    console.log("🔗 Añadiendo protocolo http:// a la URL base:", baseUrl)
    return `http://${baseUrl}`
  }

  console.log("🔗 Usando URL base:", baseUrl)
  return baseUrl
}

// Funciones para interactuar con la API externa
export async function getClientes(): Promise<Cliente[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/clientes`)
    if (!response.ok) {
      throw new Error(`Error al cargar los clientes: ${response.status}`)
    }

    const data = await response.json()
    console.log("Clientes recibidos desde la API:", data)

    const clientesValidos = (data as Cliente[]).filter(
      (c) => c.idCliente !== undefined && c.idCliente !== null && c.idCliente !== "",
    )

    return clientesValidos
  } catch (error) {
    console.error("Error fetching clientes:", error)
    return []
  }
}

export async function getCliente(id: string): Promise<Cliente | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/clientes/${id}`)
    if (!response.ok) {
      throw new Error(`Error al obtener el cliente: ${response.status}`)
    }

    const data = await response.json()
    return data as Cliente
  } catch (error) {
    console.error(`Error fetching cliente ${id}:`, error)
    return null
  }
}

export async function createCliente(cliente: Omit<Cliente, "idCliente">): Promise<Cliente | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/clientes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error al crear el cliente: ${response.status}`)
    }

    const data = await response.json()
    return data as Cliente
  } catch (error) {
    console.error("Error creating cliente:", error)
    throw error
  }
}

export async function updateCliente(id: string, cliente: Omit<Cliente, "idCliente">): Promise<Cliente | null> {
  try {
    // Usar PUT para actualizar
    const response = await fetch(`${getApiBaseUrl()}/api/clientes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error al actualizar el cliente: ${response.status}`)
    }

    const data = await response.json()
    return data as Cliente
  } catch (error) {
    console.error(`Error updating cliente ${id}:`, error)
    throw error
  }
}

export async function deleteCliente(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/clientes/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error al eliminar el cliente: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error(`Error deleting cliente ${id}:`, error)
    throw error
  }
}

export async function getProductos(): Promise<Producto[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/productos`)
    if (!response.ok) {
      throw new Error(`Error al cargar los productos: ${response.status}`)
    }

    const data = await response.json()
    console.log("Productos recibidos desde la API:", data)

    const productosValidos = (data as Producto[]).filter(
      (p) => p.idProducto !== undefined && p.idProducto !== null && p.idProducto !== "",
    )

    const productosInvalidos = (data as Producto[]).filter((p) => !p.idProducto || p.idProducto === "")

    if (productosInvalidos.length > 0) {
      console.warn("Productos con idProducto inválido:", productosInvalidos)
    }

    return productosValidos
  } catch (error) {
    console.error("Error fetching productos:", error)
    return []
  }
}

export async function getProducto(id: string): Promise<Producto | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/productos/${id}`)
    if (!response.ok) {
      throw new Error(`Error al obtener el producto: ${response.status}`)
    }

    const data = await response.json()
    return data as Producto
  } catch (error) {
    console.error(`Error fetching producto ${id}:`, error)
    return null
  }
}

export async function createProducto(producto: Omit<Producto, "idProducto">): Promise<Producto | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error al crear el producto: ${response.status}`)
    }

    const data = await response.json()
    return data as Producto
  } catch (error) {
    console.error("Error creating producto:", error)
    throw error
  }
}

export async function updateProducto(id: string, producto: Omit<Producto, "idProducto">): Promise<Producto | null> {
  try {
    // Usar PUT para actualizar
    const response = await fetch(`${getApiBaseUrl()}/api/productos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error al actualizar el producto: ${response.status}`)
    }

    const data = await response.json()
    return data as Producto
  } catch (error) {
    console.error(`Error updating producto ${id}:`, error)
    throw error
  }
}

export async function deleteProducto(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/productos/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error al eliminar el producto: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error(`Error deleting producto ${id}:`, error)
    throw error
  }
}

export async function getPedidos(): Promise<Pedido[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/pedidos`)
    if (!response.ok) {
      throw new Error(`Error al cargar los pedidos: ${response.status}`)
    }
    const data = await response.json()
    console.log("Pedidos recibidos desde la API:", data)
    return data as Pedido[]
  } catch (error) {
    console.error("Error fetching pedidos:", error)
    return []
  }
}

export async function getPedido(id: string): Promise<Pedido | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/pedidos/${id}`)
    if (!response.ok) {
      throw new Error(`Error al obtener el pedido: ${response.status}`)
    }
    const data = await response.json()
    return data as Pedido
  } catch (error) {
    console.error(`Error fetching pedido ${id}:`, error)
    return null
  }
}

export async function getDetallesPedido(idPedido: string): Promise<DetallePedido[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/detalles/${idPedido}`)
    if (!response.ok) {
      throw new Error(`Error al cargar los detalles del pedido: ${response.status}`)
    }
    const data = await response.json()
    return data as DetallePedido[]
  } catch (error) {
    console.error(`Error fetching detalles del pedido ${idPedido}:`, error)
    return []
  }
}

export async function addPedido(
  pedido: Omit<Pedido, "idPedido">,
  detalles: Omit<DetallePedido, "idDetalle" | "idPedido">[],
): Promise<{ success: boolean; message: string; idPedido?: string }> {
  try {
    // Crear el pedido
    const pedidoResponse = await fetch(`${getApiBaseUrl()}/api/pedidos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido),
    })

    if (!pedidoResponse.ok) {
      const errorData = await pedidoResponse.json()
      throw new Error(errorData.error || `Error al crear el pedido: ${pedidoResponse.status}`)
    }

    const pedidoData = await pedidoResponse.json()
    const idPedido = pedidoData.idPedido

    // Crear los detalles del pedido
    for (const detalle of detalles) {
      const detalleResponse = await fetch(`${getApiBaseUrl()}/api/detalle-pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...detalle, idPedido }),
      })

      if (!detalleResponse.ok) {
        const errorData = await detalleResponse.json()
        throw new Error(errorData.error || `Error al crear el detalle del pedido: ${detalleResponse.status}`)
      }
    }

    return { success: true, message: "Pedido creado exitosamente", idPedido }
  } catch (error: any) {
    console.error("Error al crear el pedido:", error)
    return { success: false, message: error.message || "Error al crear el pedido" }
  }
}

export async function updatePedido(
  id: string,
  pedido: Omit<Pedido, "idPedido">,
  detalles?: Omit<DetallePedido, "idDetalle" | "idPedido">[],
): Promise<{ success: boolean; message: string; pedido?: Pedido }> {
  try {
    // Usar PUT para actualizar el pedido
    const pedidoResponse = await fetch(`${getApiBaseUrl()}/api/pedidos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido),
    })

    if (!pedidoResponse.ok) {
      const errorData = await pedidoResponse.json()
      throw new Error(errorData.error || `Error al actualizar el pedido: ${pedidoResponse.status}`)
    }

    const pedidoData = await pedidoResponse.json()

    // Si hay detalles, actualizarlos
    if (detalles && detalles.length > 0) {
      // Primero eliminar los detalles existentes
      await fetch(`${getApiBaseUrl()}/api/detalles/${id}`, {
        method: "DELETE",
      })

      // Luego crear los nuevos detalles
      for (const detalle of detalles) {
        const detalleResponse = await fetch(`${getApiBaseUrl()}/api/detalle-pedidos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...detalle, idPedido: id }),
        })

        if (!detalleResponse.ok) {
          const errorData = await detalleResponse.json()
          throw new Error(errorData.error || `Error al actualizar el detalle del pedido: ${detalleResponse.status}`)
        }
      }
    }

    return { success: true, message: "Pedido actualizado exitosamente", pedido: pedidoData }
  } catch (error: any) {
    console.error(`Error updating pedido ${id}:`, error)
    return { success: false, message: error.message || "Error al actualizar el pedido" }
  }
}

export async function deletePedido(id: string): Promise<boolean> {
  try {
    // Primero eliminar los detalles
    await fetch(`${getApiBaseUrl()}/api/detalles/${id}`, {
      method: "DELETE",
    })

    // Luego eliminar el pedido
    const response = await fetch(`${getApiBaseUrl()}/api/pedidos/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Error al eliminar el pedido: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error(`Error deleting pedido ${id}:`, error)
    throw error
  }
}

export async function login(formData: { idUsuario: string; passwd: string }) {
  try {
    console.log("📤 Enviando datos de login:", formData)

    const apiUrl = `${getApiBaseUrl()}/api/usuarios`
    console.log("🔗 URL completa de la API:", apiUrl)

    // Obtener todos los usuarios con GET
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("📥 Respuesta recibida - Status:", response.status, response.statusText)
    console.log("📥 Headers:", Object.fromEntries(response.headers.entries()))

    // Obtener el texto de la respuesta antes de intentar parsearlo
    const responseText = await response.text()
    console.log("📥 Respuesta como texto (primeros 500 caracteres):", responseText.substring(0, 500))

    // Intentar parsear el texto como JSON
    let data
    try {
      data = JSON.parse(responseText)
      console.log("🔍 Respuesta parseada como JSON:", data)
    } catch (parseError) {
      console.error("❌ Error al parsear JSON:", parseError)
      console.log("❌ Los primeros 500 caracteres de la respuesta:", responseText.substring(0, 500))
      throw new Error(`Error al parsear la respuesta: ${parseError.message}`)
    }

    // Verificar si los datos de respuesta son un array válido
    if (!Array.isArray(data)) {
      console.error("❌ La respuesta no es un array:", data)
      throw new Error("La respuesta del servidor no es un array de usuarios válido.")
    }

    // Buscar el usuario en el array de usuarios
    const usuario = data.find(
      (user: { idUsuario: string; passwd: string }) =>
        user.idUsuario === formData.idUsuario && user.passwd === formData.passwd,
    )

    // Verificar si el usuario fue encontrado
    console.log("👤 Usuario encontrado:", usuario)

    // Validación explícita de éxito
    const esValido = usuario !== undefined
    console.log("✅ Login válido:", esValido)

    if (!esValido) {
      throw new Error("Credenciales incorrectas")
    }

    // Aquí podrías devolver un token real, por ahora, estamos simulando un "fake_token".
    return {
      success: true,
      token: "fake_token", // Asegúrate de devolver el token real si lo tienes.
      user: usuario,
    }
  } catch (error: any) {
    console.error("❌ Error en login:", error)
    return {
      success: false,
      error: error.message || "Error de conexión",
    }
  }
}
