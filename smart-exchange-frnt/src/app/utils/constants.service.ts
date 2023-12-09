export const SOLES_ISO = 604
export const USD_ISO = 840
export const EURO_ISO = 978
export const MONEDAS = [
    {codigo: USD_ISO, nombre: 'Dólares'},
    {codigo: EURO_ISO, nombre: 'Euros'},
]
export const TIPO_DOCUMENTOS = [
    {codigo: 1, nombre: 'DNI'},
    {codigo: 2, nombre: 'RUC'},
    {codigo: 3, nombre: 'Carnet extranjero'},
    {codigo: 4, nombre: 'Pasaporte'},
]
export const TIPO_CUENTAS = [
    {codigo: 1, nombre: 'Ahorro'},
    {codigo: 2, nombre: 'Corriente'},
]
export const CUENTA_MONEDAS_CLIENTE = [
    {codigo: SOLES_ISO, nombre: 'Soles'},
    {codigo: USD_ISO, nombre: 'Dólares'},
]