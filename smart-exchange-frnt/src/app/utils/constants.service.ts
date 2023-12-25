export const SOLES_ISO = 604
export const USD_ISO = 840
export const EURO_ISO = 978

export const ESTADOS_GENERICOS = [
    {codigo: 0, nombre: 'Activo'},
    {codigo: 1, nombre: 'Eliminado'},
    {codigo: 2, nombre: 'Deshabilitado'},
]
export const MONEDAS = [
    {codigo: USD_ISO, nombre: 'Dólares'},
    {codigo: EURO_ISO, nombre: 'Euros'},
]
export const TIPO_DOCUMENTOS = [
    {codigo: 1, nombre: 'DNI', abrev:'DNI'},
    {codigo: 2, nombre: 'RUC', abrev:'RUC'},
    {codigo: 3, nombre: 'Carnet extranjero', abrev:'CE'},
    {codigo: 4, nombre: 'Pasaporte', abrev:'P'},
]
export const TIPO_CUENTAS = [
    {codigo: 1, nombre: 'Ahorro'},
    {codigo: 2, nombre: 'Corriente'},
]
export const TIPO_BUSQUEDAS_CLIENTES = [
    {codigo: 1, nombre: 'TODO'},
    {codigo: 2, nombre: 'APELLIDO'},
    {codigo: 3, nombre: 'NRO. DOCUMENTO'},
]
export const CUENTA_MONEDAS_CLIENTE = [
    {codigo: SOLES_ISO, nombre: 'Soles'},
    {codigo: USD_ISO, nombre: 'Dólares'},
]
export const TIPO_CAMBIOS = [
    {codigo: 1, nombre: 'Oficial'},
    {codigo: 2, nombre: 'Empresa'},
]
export const ESTADOS_OPERACION = [
    {codigo: 0, nombre: 'Activo'},
    {codigo: 1, nombre: 'Eliminado'},
    {codigo: 2, nombre: 'Deshabilitado'},
    {codigo: 3, nombre: 'En curso'},
    {codigo: 4, nombre: 'Rechazado'},
    {codigo: 5, nombre: 'Anulado'},
    {codigo: 6, nombre: 'Preliminar'},
    {codigo: 10, nombre: 'Finalilzado'},
]
export const TIPO_TRANSFERENCIAS = [
    {codigo: 1, nombre: 'Normal'},
    {codigo: 2, nombre: 'QR'},
]





export function buscarNombrePorCodigo(codigo: number, lista: {codigo: number, nombre: string}[]): string {
    const itemEncontrado = lista.find(item => item.codigo === codigo);
    return itemEncontrado ? itemEncontrado.nombre : '';
}
  