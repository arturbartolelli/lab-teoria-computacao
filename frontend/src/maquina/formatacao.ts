import type { Transicao } from '../api/tipos'

export const DIGITOS_TRANSICAO = 2
export const DIGITOS_PASSO = 4

const CAMINHO_DE_TRANSICAO = /transicoes\[(\d+)\]\./g

export function formatarIndice(indice: number, digitos: number): string {
  return String(indice).padStart(digitos, '0')
}

export function formatarTransicao(transicao: Transicao): string {
  const { estadoAtual, simboloLido, novoEstado, simboloEscrito, direcao } = transicao
  return `δ(${estadoAtual}, ${simboloLido}) = (${novoEstado}, ${simboloEscrito}, ${direcao})`
}

export function numerarTransicoesNoErro(mensagem: string): string {
  return mensagem.replace(
    CAMINHO_DE_TRANSICAO,
    (_trecho, indice: string) => `transição ${formatarIndice(Number(indice) + 1, DIGITOS_TRANSICAO)} › `,
  )
}
