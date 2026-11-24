import { type ComId, comId, semId } from '../../compartilhado/hooks/useDefinicao'
import { paraVazio, separarLista } from '../../compartilhado/formatacao'
import type { Direcao, SimulacaoRequest, Transicao } from './tipos'

export interface DefinicaoMaquina {
  cadeia: string
  estadoInicial: string
  estadosFinais: string
  regras: ComId<Transicao>[]
}

type TransicaoCompacta = [string, string, string, string, Direcao]

interface Exemplo {
  cadeia: string
  estadoInicial: string
  estadosFinais: string
  transicoes: TransicaoCompacta[]
}

const EXEMPLOS = {
  'opção B: soma unária (3 + 2)': {
    cadeia: '000100',
    estadoInicial: 'q0',
    estadosFinais: 'q3',
    transicoes: [
      ['q0', '0', 'q0', '0', 'R'],
      ['q0', '1', 'q1', '0', 'R'],
      ['q1', '0', 'q1', '0', 'R'],
      ['q1', 'B', 'q2', 'B', 'L'],
      ['q2', '0', 'q3', 'B', 'R'],
    ],
  },
  'opção A: L = { w#w }': {
    cadeia: '0110#0110',
    estadoInicial: 'q1',
    estadosFinais: 'qaceita',
    transicoes: [
      ['q1', '0', 'q2', 'x', 'R'],
      ['q1', '1', 'q3', 'x', 'R'],
      ['q1', '#', 'q8', '#', 'R'],
      ['q2', '0', 'q2', '0', 'R'],
      ['q2', '1', 'q2', '1', 'R'],
      ['q2', '#', 'q4', '#', 'R'],
      ['q3', '0', 'q3', '0', 'R'],
      ['q3', '1', 'q3', '1', 'R'],
      ['q3', '#', 'q5', '#', 'R'],
      ['q4', 'x', 'q4', 'x', 'R'],
      ['q4', '0', 'q6', 'x', 'L'],
      ['q5', 'x', 'q5', 'x', 'R'],
      ['q5', '1', 'q6', 'x', 'L'],
      ['q6', '0', 'q6', '0', 'L'],
      ['q6', '1', 'q6', '1', 'L'],
      ['q6', 'x', 'q6', 'x', 'L'],
      ['q6', '#', 'q7', '#', 'L'],
      ['q7', '0', 'q7', '0', 'L'],
      ['q7', '1', 'q7', '1', 'L'],
      ['q7', 'x', 'q1', 'x', 'R'],
      ['q8', 'x', 'q8', 'x', 'R'],
      ['q8', 'B', 'qaceita', 'B', 'R'],
    ],
  },
  'L = { 0^(2ⁿ) }: potências de 2': {
    cadeia: '0000',
    estadoInicial: 'q1',
    estadosFinais: 'qaceita',
    transicoes: [
      ['q1', '0', 'q2', 'B', 'R'],
      ['q2', 'x', 'q2', 'x', 'R'],
      ['q2', 'B', 'qaceita', 'B', 'R'],
      ['q2', '0', 'q3', 'x', 'R'],
      ['q3', 'x', 'q3', 'x', 'R'],
      ['q3', '0', 'q4', '0', 'R'],
      ['q3', 'B', 'q5', 'B', 'L'],
      ['q4', 'x', 'q4', 'x', 'R'],
      ['q4', '0', 'q3', 'x', 'R'],
      ['q5', '0', 'q5', '0', 'L'],
      ['q5', 'x', 'q5', 'x', 'L'],
      ['q5', 'B', 'q2', 'B', 'R'],
    ],
  },
  'máquina da aula': {
    cadeia: '0001001',
    estadoInicial: 'q0',
    estadosFinais: 'q3',
    transicoes: [
      ['q0', '0', 'q0', '0', 'R'],
      ['q0', '1', 'q1', '0', 'R'],
      ['q1', '0', 'q1', '0', 'R'],
      ['q1', '1', 'q2', 'B', 'L'],
      ['q2', '0', 'q3', 'B', 'R'],
    ],
  },
  'L = { 0ⁿ1ⁿ }': {
    cadeia: '0011',
    estadoInicial: 'q0',
    estadosFinais: 'q4',
    transicoes: [
      ['q0', '0', 'q1', 'X', 'R'],
      ['q0', 'Y', 'q3', 'Y', 'R'],
      ['q0', 'B', 'q4', 'B', 'R'],
      ['q1', '0', 'q1', '0', 'R'],
      ['q1', 'Y', 'q1', 'Y', 'R'],
      ['q1', '1', 'q2', 'Y', 'L'],
      ['q2', '0', 'q2', '0', 'L'],
      ['q2', 'Y', 'q2', 'Y', 'L'],
      ['q2', 'X', 'q0', 'X', 'R'],
      ['q3', 'Y', 'q3', 'Y', 'R'],
      ['q3', 'B', 'q4', 'B', 'R'],
    ],
  },
} satisfies Record<string, Exemplo>

export type NomeExemplo = keyof typeof EXEMPLOS

export const NOMES_EXEMPLOS = Object.keys(EXEMPLOS) as NomeExemplo[]

export function transicaoVazia(): Transicao {
  return { estadoAtual: '', simboloLido: '', novoEstado: '', simboloEscrito: '', direcao: 'R' }
}

export function definicaoDeExemplo(nome: NomeExemplo = 'opção B: soma unária (3 + 2)'): DefinicaoMaquina {
  const { transicoes, ...campos }: Exemplo = EXEMPLOS[nome]
  return {
    ...campos,
    regras: transicoes.map(([estadoAtual, simboloLido, novoEstado, simboloEscrito, direcao]) =>
      comId({ estadoAtual, simboloLido, novoEstado, simboloEscrito, direcao }),
    ),
  }
}

export function definicaoVazia(): DefinicaoMaquina {
  return { cadeia: '', estadoInicial: 'q0', estadosFinais: '', regras: [comId(transicaoVazia())] }
}

export function montarRequisicao(definicao: DefinicaoMaquina): SimulacaoRequest {
  return {
    cadeia: paraVazio(definicao.cadeia),
    estadoInicial: definicao.estadoInicial,
    estadosFinais: separarLista(definicao.estadosFinais),
    transicoes: semId(definicao.regras),
  }
}
