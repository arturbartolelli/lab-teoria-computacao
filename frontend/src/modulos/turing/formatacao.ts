import type { Transicao } from './tipos'

export function formatarTransicao(transicao: Transicao): string {
  const { estadoAtual, simboloLido, novoEstado, simboloEscrito, direcao } = transicao
  return `δ(${estadoAtual}, ${simboloLido}) = (${novoEstado}, ${simboloEscrito}, ${direcao})`
}
