export const TOAST_TIME = 6000

export const SOLES_ISO = 604
export const USD_ISO = 840
export const EURO_ISO = 978

export const OP_ACTIVO = 0
export const OP_EN_CURSO = 3
export const OP_ANULADO = 5
export const OP_PRELIMINAR = 6
export const OP_FINALIZADO = 10

export const CUENTA_MONEDAS_CLIENTE = [
    {codigo: SOLES_ISO, nombre: 'Soles', abrev: '/S'},
    {codigo: USD_ISO, nombre: 'Dólares', abrev: 'USD'},
]
export const TIPO_CUENTAS = [
    {codigo: 1, nombre: 'Ahorro'},
    {codigo: 2, nombre: 'Corriente'},
]

export const TIPO_DOCUMENTOS = [
    {codigo: 1, nombre: 'DNI', abrev:'DNI'},
    {codigo: 2, nombre: 'RUC', abrev:'RUC'},
    {codigo: 3, nombre: 'Carnet extranjero', abrev:'CE'},
    {codigo: 4, nombre: 'Pasaporte', abrev:'P'},
]

export const ESTADOS_GENERICOS = [
    {codigo: 0, nombre: 'Activo'},
    {codigo: 1, nombre: 'Eliminado'},
    {codigo: 2, nombre: 'Deshabilitado'},
]

export const ESTADOS_OPERACION = [
    {codigo: OP_ACTIVO, nombre: 'Activo', class:'op-est-activo'},
    {codigo: 1, nombre: 'Eliminado', class:'op-est-eliminado'},
    {codigo: 2, nombre: 'Deshabilitado', class:'op-est-deshabilitado'},
    {codigo: OP_EN_CURSO, nombre: 'En curso', class:'op-est-en-curso'},
    {codigo: 4, nombre: 'Rechazado', class:'op-est-rechazado'},
    {codigo: OP_ANULADO, nombre: 'Anulado', class:'op-est-anulado'},
    {codigo: OP_PRELIMINAR, nombre: 'Preliminar', class:'op-est-preliminar'},
    {codigo: OP_FINALIZADO, nombre: 'Finalilzado', class:'op-est-finalizado'},
]

export const TIPO_TRANSFERENCIAS = [
    {codigo: 1, nombre: 'Normal'},
    {codigo: 2, nombre: 'QR'},
]

export function buscarClassPorCodigo(codigo: number, lista: {codigo: number, class: string}[]): string {
    const itemEncontrado = lista.find(item => item.codigo === codigo);
    return itemEncontrado ? itemEncontrado.class : '';
}

export function buscarNombrePorCodigo(codigo: number, lista: {codigo: number, nombre: string}[]): string {
    const itemEncontrado = lista.find(item => item.codigo === codigo);
    return itemEncontrado ? itemEncontrado.nombre : '';
}
export function buscarAbrevPorCodigo(codigo: number, lista: {codigo: number, abrev: string}[]): string {
    const itemEncontrado = lista.find(item => item.codigo === codigo);
    return itemEncontrado ? itemEncontrado.abrev : '';
}