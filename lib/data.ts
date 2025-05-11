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

// Detalle de pedido
export interface DetallePedido {
  idDetalle?: string
  idPedido: string
  idProducto: string
  cantidad: number
  precio: number
  totalDeta: number
  descripcion?: string
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

// Función para obtener la URL base de la API desde las variables de entorno
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL || ""
}

// Funciones para interactuar con la API externa
export async function getClientes(): Promise<Cliente[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/clientes`)
    if (!response.ok) {
      throw new Error(`Error al cargar los clientes: ${response.status}`)
    }

    const data = await response.json()

    const clientesValidos = (data as Cliente[]).filter(
      (c) => c.idCliente !== undefined && c.idCliente !== null && c.idCliente !== ''
    )


    return clientesValidos
  } catch (error) {
    return []
  }
}

export async function getCliente(id: string): Promise<Cliente | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/clientes/${id}`)
    if (!response.ok) {
      throw new Error(`Error al cargar el cliente: ${response.status}`)
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

export async function getProductos(): Promise<Producto[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/productos`)
    if (!response.ok) {
      throw new Error(`Error al cargar los productos: ${response.status}`)
    }

    const data = await response.json();
    console.log("Productos recibidos desde la API:", data);

    const productosValidos = (data as Producto[]).filter(
      (p) => p.idProducto !== undefined && p.idProducto !== null && p.idProducto !== ''
    );

    const productosInvalidos = (data as Producto[]).filter(
      (p) => !p.idProducto || p.idProducto === ''
    );

    if (productosInvalidos.length > 0) {
      console.warn("Productos con idProducto inválido:", productosInvalidos);
    }

    return productosValidos;
  } catch (error) {
    console.error("Error fetching productos:", error);
    return [];
  }
}


export async function getProducto(id: string): Promise<Producto | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/productos/${id}`)
    if (!response.ok) {
      throw new Error(`Error al cargar el producto: ${response.status}`)
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

export async function getPedidos(): Promise<Pedido[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/pedidos`)
    if (!response.ok) {
      throw new Error(`Error al cargar los pedidos: ${response.status}`)
    }
    const data = await response.json()
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
      throw new Error(`Error al cargar el pedido: ${response.status}`)
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
    const response = await fetch(`${getApiBaseUrl()}/api/detalle-pedidos?idPedido=${idPedido}`)
    if (!response.ok) {
      throw new Error(`Error al cargar los detalles del pedido: ${response.status}`)
    }
    const data = await response.json()
    return data as DetallePedido[]
  } catch (error) {
    console.error(`Error fetching detalles for pedido ${idPedido}:`, error)
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
export async function login(formData: { idUsuario: string, passwd: string }) {
  try {
    console.log("📤 Enviando datos de login:", formData)

    // Obtener todos los usuarios con GET
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/usuarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()
    console.log("🔍 Respuesta del backend:", data)

    // Verificar si los datos de respuesta son un array válido
    if (!Array.isArray(data)) {
      throw new Error("La respuesta del servidor no es un array de usuarios válido.")
    }

    // Buscar el usuario en el array de usuarios
    const usuario = data.find((user: { idUsuario: string, passwd: string }) => 
      user.idUsuario === formData.idUsuario && user.passwd === formData.passwd
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

