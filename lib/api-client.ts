"use server"

type DniResponse = {
  nombres: string
  apellidoPaterno: string
  apellidoMaterno: string
  nombreCompleto: string
  tipoDocumento: string
  numeroDocumento: string
  digitoVerificador: string
}

type RucResponse = {
  razonSocial: string
  tipoDocumento: string
  numeroDocumento: string
  estado: string
  condicion: string
  direccion: string
  ubigeo: string
  viaTipo: string
  viaNombre: string
  zonaCodigo: string
  zonaTipo: string
  numero: string
  interior: string
  lote: string
  dpto: string
  manzana: string
  kilometro: string
  distrito: string
  provincia: string
  departamento: string
  EsAgenteRetencion: boolean
  EsBuenContribuyente: boolean
  localesAnexos: Array<{
    direccion: string
    ubigeo: string
    departamento: string
    provincia: string
    distrito: string
  }>
}

export async function fetchDniData(dni: string): Promise<DniResponse> {
  const token = process.env.TOKEN_API_CLIENTE

  if (!token) {
    throw new Error("Token de API no configurado")
  }

  const response = await fetch(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store", // Asegura que no se use caché
  })

  if (!response.ok) {
    throw new Error(`Error al consultar el DNI: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchRucData(ruc: string): Promise<RucResponse> {
  const token = process.env.TOKEN_API_CLIENTE

  if (!token) {
    throw new Error("Token de API no configurado")
  }

  const response = await fetch(`https://api.apis.net.pe/v2/sunat/ruc?numero=${ruc}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store", // Asegura que no se use caché
  })

  if (!response.ok) {
    throw new Error(`Error al consultar el RUC: ${response.statusText}`)
  }

  return response.json()
}
