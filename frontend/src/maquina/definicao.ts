import type { SimulacaoRequest, Transicao } from '../api/tipos'

export interface TransicaoEditavel extends Transicao {
  id: string
}

export interface DefinicaoMaquina {
  cadeia: string
  estadoInicial: string
  estadosFinais: string
  transicoes: TransicaoEditavel[]
}

export type CampoDefinicao = Exclude<keyof DefinicaoMaquina, 'transicoes'>

const SEPARADOR_DE_ESTADOS = /[\s,]+/

const TRANSICAO_VAZIA: Transicao = {
  estadoAtual: '',
  simboloLido: '',
  novoEstado: '',
  simboloEscrito: '',
  direcao: 'R',
}

const TRANSICOES_DO_EXEMPLO: Transicao[] = [
  { estadoAtual: 'q0', simboloLido: '0', novoEstado: 'q0', simboloEscrito: '0', direcao: 'R' },
  { estadoAtual: 'q0', simboloLido: '1', novoEstado: 'q1', simboloEscrito: '0', direcao: 'R' },
  { estadoAtual: 'q1', simboloLido: '0', novoEstado: 'q1', simboloEscrito: '0', direcao: 'R' },
  { estadoAtual: 'q1', simboloLido: '1', novoEstado: 'q2', simboloEscrito: 'B', direcao: 'L' },
  { estadoAtual: 'q2', simboloLido: '0', novoEstado: 'q3', simboloEscrito: 'B', direcao: 'R' },
]

export function novaTransicao(dados: Transicao = TRANSICAO_VAZIA): TransicaoEditavel {
  return { ...dados, id: crypto.randomUUID() }
}

export function definicaoDeExemplo(): DefinicaoMaquina {
  return {
    cadeia: '0001001',
    estadoInicial: 'q0',
    estadosFinais: 'q3',
    transicoes: TRANSICOES_DO_EXEMPLO.map((transicao) => novaTransicao(transicao)),
  }
}

export function definicaoVazia(): DefinicaoMaquina {
  return { cadeia: '', estadoInicial: 'q0', estadosFinais: '', transicoes: [novaTransicao()] }
}

export function montarRequisicao(definicao: DefinicaoMaquina): SimulacaoRequest {
  return {
    cadeia: definicao.cadeia,
    estadoInicial: definicao.estadoInicial,
    estadosFinais: separarEstados(definicao.estadosFinais),
    transicoes: definicao.transicoes.map(({ id: _id, ...transicao }) => transicao),
  }
}

function separarEstados(texto: string): string[] {
  const estados = texto.split(SEPARADOR_DE_ESTADOS).filter(Boolean)
  return [...new Set(estados)]
}
