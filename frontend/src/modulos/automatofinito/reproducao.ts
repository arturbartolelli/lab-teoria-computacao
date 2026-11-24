import { chaveDaAresta } from '../../compartilhado/diagrama'
import { EPSILON, exibirVazio, formatarConjunto } from '../../compartilhado/formatacao'
import type { ResultadoAutomato, TransicaoAutomato } from './tipos'

interface QuadroAutomato {
  ativos: string[]
  destacadas: string[]
  consumidos: number
}

const VAZIO = '∅'

export function montarQuadros(resultado: ResultadoAutomato): QuadroAutomato[] {
  const inicial = {
    ativos: resultado.estadosIniciaisAtivos,
    destacadas: resultado.transicoesVaziasIniciais.map(chaveDaAresta),
    consumidos: 0,
  }
  const seguintes = resultado.passos.map((passo) => ({
    ativos: passo.estadosAtuais,
    destacadas: [...passo.transicoes, ...passo.transicoesVazias].map(chaveDaAresta),
    consumidos: passo.numero,
  }))
  return [inicial, ...seguintes]
}

function formatarEstados(estados: string[], deterministico: boolean): string {
  if (estados.length === 0) {
    return VAZIO
  }
  return deterministico && estados.length === 1 ? (estados[0] ?? VAZIO) : formatarConjunto(estados)
}

export function caminho(resultado: ResultadoAutomato): string {
  const deterministico = resultado.tipo === 'AFD'
  return montarQuadros(resultado)
    .map((quadro) => formatarEstados(quadro.ativos, deterministico))
    .join(' → ')
}

function descreverVazias(transicoes: TransicaoAutomato[]): string {
  const movimentos = transicoes.map(({ origem, destino }) => `${origem} → ${destino}`)
  return movimentos.length === 0 ? '' : ` · por ${EPSILON}: ${movimentos.join(', ')}`
}

export function linhasDoLog(resultado: ResultadoAutomato): string[] {
  const deterministico = resultado.tipo === 'AFD'
  const inicio = `início em ${formatarEstados(resultado.estadosIniciaisAtivos, deterministico)}${descreverVazias(resultado.transicoesVaziasIniciais)}`
  const passos = resultado.passos.map(
    (passo) =>
      `δ(${formatarEstados(passo.estadosAnteriores, deterministico)}, ${exibirVazio(passo.simbolo)}) = ${formatarEstados(passo.estadosAtuais, deterministico)}${descreverVazias(passo.transicoesVazias)}`,
  )
  return [inicio, ...passos]
}
