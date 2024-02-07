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
    {codigo: SOLES_ISO, nombre: 'Soles'},
    {codigo: USD_ISO, nombre: 'Dólares'},
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