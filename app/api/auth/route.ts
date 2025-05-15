import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.idUsuario || !body.passwd) {
      return NextResponse.json({ error: "Los campos idUsuario y passwd son obligatorios" }, { status: 400 })
    }

    // Hacer una solicitud a la API externa para obtener los usuarios
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/usuarios`, {
      method: "GET",
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(`Error al obtener los usuarios desde la API: ${errorData.error || res.statusText}`)
    }

    const usuarios = await res.json()

    console.debug("Usuarios obtenidos de la API:", usuarios)

    // Buscar el usuario en la respuesta
    const usuario = usuarios.find((u: { idUsuario: string }) => u.idUsuario === body.idUsuario)

    console.debug("Usuario encontrado:", usuario)

    // Verificar si el usuario existe y la contraseña es correcta
    if (!usuario || usuario.passwd !== body.passwd) {
      console.debug("Credenciales incorrectas para el usuario:", body.idUsuario)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Devolver información del usuario (sin la contraseña)
    const { passwd, ...usuarioInfo } = usuario
    console.debug("Autenticación exitosa para el usuario:", usuarioInfo)

    // Retornar un token JWT simulado (en una app real, debes generar un JWT aquí)
    return NextResponse.json({
      ...usuarioInfo,
      token: "jwt-token-simulado", // En una aplicación real, esto sería un JWT válido
    })
  } catch (error) {
    console.error("Error en autenticación:", error)
    return NextResponse.json({ error: "Error en el proceso de autenticación" }, { status: 500 })
  }
}
