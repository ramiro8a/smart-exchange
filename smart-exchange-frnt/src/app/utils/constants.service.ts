export const SOLES_ISO = 604
export const USD_ISO = 840
export const EURO_ISO = 978
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