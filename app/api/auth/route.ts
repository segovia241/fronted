import { type NextRequest, NextResponse } from "next/server"
import { getApiBaseUrl } from "@/lib/data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos requeridos
    if (!body.idUsuario || !body.passwd) {
      return NextResponse.json({ error: "Los campos idUsuario y passwd son obligatorios" }, { status: 400 })
    }

    console.log("🔐 Intentando autenticar usuario:", body.idUsuario)

    const apiUrl = `${getApiBaseUrl()}/api/usuarios`
    console.log("🔗 URL completa de la API:", apiUrl)

    // Hacer una solicitud a la API externa para obtener los usuarios
    const res = await fetch(apiUrl, {
      method: "GET",
    })

    console.log("📥 Respuesta de la API - Status:", res.status, res.statusText)
    console.log("📥 Headers:", Object.fromEntries(res.headers.entries()))

    // Obtener el texto de la respuesta antes de intentar parsearlo
    const responseText = await res.text()
    console.log("📥 Respuesta como texto (primeros 500 caracteres):", responseText.substring(0, 500))

    if (!res.ok) {
      console.error("❌ Error en la respuesta de la API:", responseText)
      return NextResponse.json(
        { error: `Error al obtener los usuarios: ${res.status} ${res.statusText}` },
        { status: res.status },
      )
    }

    // Intentar parsear el texto como JSON
    let usuarios
    try {
      usuarios = JSON.parse(responseText)
      console.log("🔍 Usuarios parseados:", usuarios)
    } catch (parseError) {
      console.error("❌ Error al parsear JSON:", parseError)
      return NextResponse.json({ error: `Error al parsear la respuesta: ${parseError.message}` }, { status: 500 })
    }

    // Verificar si los datos de respuesta son un array válido
    if (!Array.isArray(usuarios)) {
      console.error("❌ La respuesta no es un array:", usuarios)
      return NextResponse.json(
        { error: "La respuesta del servidor no es un array de usuarios válido" },
        { status: 500 },
      )
    }

    // Buscar el usuario en la respuesta
    const usuario = usuarios.find((u: { idUsuario: string }) => u.idUsuario === body.idUsuario)

    console.log("👤 Usuario encontrado:", usuario)

    // Verificar si el usuario existe y la contraseña es correcta
    if (!usuario || usuario.passwd !== body.passwd) {
      console.log("❌ Credenciales incorrectas para el usuario:", body.idUsuario)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Devolver información del usuario (sin la contraseña)
    const { passwd, ...usuarioInfo } = usuario
    console.log("✅ Autenticación exitosa para el usuario:", usuarioInfo)

    // Retornar un token JWT simulado (en una app real, debes generar un JWT aquí)
    return NextResponse.json({
      ...usuarioInfo,
      token: "jwt-token-simulado", // En una aplicación real, esto sería un JWT válido
    })
  } catch (error) {
    console.error("❌ Error en autenticación:", error)
    return NextResponse.json({ error: `Error en el proceso de autenticación: ${error.message}` }, { status: 500 })
  }
}
