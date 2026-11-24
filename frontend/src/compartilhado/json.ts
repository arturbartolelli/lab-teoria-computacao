type Objeto = Record<string, unknown>

export function comoObjeto(valor: unknown, contexto = 'JSON'): Objeto {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
    throw new Error(`${contexto} deve ser um objeto`)
  }
  return valor as Objeto
}

function obrigatorio(objeto: Objeto, campo: string): unknown {
  const valor = objeto[campo]
  if (valor === undefined || valor === null) {
    throw new Error(`falta o campo "${campo}"`)
  }
  return valor
}

export function texto(objeto: Objeto, campo: string, padrao?: string): string {
  const valor = objeto[campo] ?? padrao ?? obrigatorio(objeto, campo)
  if (typeof valor !== 'string' && typeof valor !== 'number') {
    throw new Error(`o campo "${campo}" deve ser texto`)
  }
  return String(valor)
}

function comoLista(objeto: Objeto, campo: string): unknown[] {
  const valor = obrigatorio(objeto, campo)
  if (!Array.isArray(valor)) {
    throw new Error(`o campo "${campo}" deve ser uma lista`)
  }
  return valor
}

export function lista(objeto: Objeto, campo: string): Objeto[] {
  return comoLista(objeto, campo).map((item, indice) => comoObjeto(item, `${campo}[${indice}]`))
}

export function listaDeTextos(objeto: Objeto, campo: string): string[] {
  return comoLista(objeto, campo).map(String)
}
