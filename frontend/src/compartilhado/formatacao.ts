export const EPSILON = 'ε'
export const LAMBDA = 'λ'
export const DIGITOS_REGRA = 2
export const DIGITOS_PASSO = 4

const CAMINHO_DE_ITEM = /(\w+)\[(\d+)\]\./g
const MARCAS_DE_VAZIO = new Set([EPSILON, LAMBDA])
const SEPARADOR_DE_LISTA = /[\s,]+/

export function formatarIndice(indice: number, digitos: number): string {
  return String(indice).padStart(digitos, '0')
}

export function numerarItensNoErro(mensagem: string): string {
  return mensagem.replace(
    CAMINHO_DE_ITEM,
    (_trecho, lista: string, indice: string) => `${lista} ${formatarIndice(Number(indice) + 1, DIGITOS_REGRA)} › `,
  )
}

export function paraVazio(texto: string): string {
  const limpo = texto.trim()
  return MARCAS_DE_VAZIO.has(limpo) ? '' : limpo
}

export function exibirVazio(texto: string, marca: string = EPSILON): string {
  return texto === '' ? marca : texto
}

export function separarLista(texto: string): string[] {
  return [...new Set(texto.split(SEPARADOR_DE_LISTA).filter(Boolean))]
}

export function formatarConjunto(itens: readonly string[]): string {
  return `{${itens.join(', ')}}`
}
