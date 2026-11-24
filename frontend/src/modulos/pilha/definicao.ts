import { type ComId, comId } from '../../compartilhado/hooks/useDefinicao'
import { EPSILON, paraVazio, separarLista } from '../../compartilhado/formatacao'
import type { AutomatoPilhaRequest, TransicaoPilha } from './tipos'

export interface DefinicaoPilha {
  cadeia: string
  estadoInicial: string
  estadosFinais: string
  regras: ComId<TransicaoPilha>[]
}

type TransicaoCompacta = [string, string, string, string, string]

interface Exemplo {
  cadeia: string
  estadoInicial: string
  estadosFinais: string
  transicoes: TransicaoCompacta[]
}

const EXEMPLOS = {
  'enunciado: L = { aⁿbⁿ | n ≥ 1 }': {
    cadeia: 'aaabbb',
    estadoInicial: 'q1',
    estadosFinais: 'q4',
    transicoes: [
      ['q1', EPSILON, EPSILON, 'q2', '$'],
      ['q2', 'a', EPSILON, 'q2', 'a'],
      ['q2', 'b', 'a', 'q3', EPSILON],
      ['q3', 'b', 'a', 'q3', EPSILON],
      ['q3', EPSILON, '$', 'q4', EPSILON],
    ],
  },
  'L = { 0ⁿ1ⁿ | n ≥ 0 }': {
    cadeia: '0011',
    estadoInicial: 'q1',
    estadosFinais: 'q1, q4',
    transicoes: [
      ['q1', EPSILON, EPSILON, 'q2', '$'],
      ['q2', '0', EPSILON, 'q2', '0'],
      ['q2', '1', '0', 'q3', EPSILON],
      ['q3', '1', '0', 'q3', EPSILON],
      ['q3', EPSILON, '$', 'q4', EPSILON],
    ],
  },
  'L = { wwᴿ } (não determinístico)': {
    cadeia: '0110',
    estadoInicial: 'q1',
    estadosFinais: 'q1, q4',
    transicoes: [
      ['q1', EPSILON, EPSILON, 'q2', '$'],
      ['q2', '0', EPSILON, 'q2', '0'],
      ['q2', '1', EPSILON, 'q2', '1'],
      ['q2', EPSILON, EPSILON, 'q3', EPSILON],
      ['q3', '0', '0', 'q3', EPSILON],
      ['q3', '1', '1', 'q3', EPSILON],
      ['q3', EPSILON, '$', 'q4', EPSILON],
    ],
  },
  'L = { wcwᴿ }': {
    cadeia: 'abcba',
    estadoInicial: 'q1',
    estadosFinais: 'q4',
    transicoes: [
      ['q1', EPSILON, EPSILON, 'q2', '$'],
      ['q2', 'a', EPSILON, 'q2', 'a'],
      ['q2', 'b', EPSILON, 'q2', 'b'],
      ['q2', 'c', EPSILON, 'q3', EPSILON],
      ['q3', 'a', 'a', 'q3', EPSILON],
      ['q3', 'b', 'b', 'q3', EPSILON],
      ['q3', EPSILON, '$', 'q4', EPSILON],
    ],
  },
} satisfies Record<string, Exemplo>

export type NomeExemplo = keyof typeof EXEMPLOS

export const NOMES_EXEMPLOS = Object.keys(EXEMPLOS) as NomeExemplo[]

export function transicaoVazia(): TransicaoPilha {
  return { origem: '', simbolo: '', topo: '', destino: '', empilhar: '' }
}

export function definicaoDeExemplo(nome: NomeExemplo = 'enunciado: L = { aⁿbⁿ | n ≥ 1 }'): DefinicaoPilha {
  const { transicoes, ...campos }: Exemplo = EXEMPLOS[nome]
  return {
    ...campos,
    regras: transicoes.map(([origem, simbolo, topo, destino, empilhar]) =>
      comId({ origem, simbolo, topo, destino, empilhar }),
    ),
  }
}

export function definicaoVazia(): DefinicaoPilha {
  return {
    cadeia: '',
    estadoInicial: 'q0',
    estadosFinais: '',
    regras: [comId(transicaoVazia())],
  }
}

export function montarRequisicao(definicao: DefinicaoPilha): AutomatoPilhaRequest {
  return {
    cadeia: paraVazio(definicao.cadeia),
    estadoInicial: definicao.estadoInicial,
    estadosFinais: separarLista(definicao.estadosFinais),
    transicoes: definicao.regras.map(({ origem, simbolo, topo, destino, empilhar }) => ({
      origem,
      simbolo: paraVazio(simbolo),
      topo: paraVazio(topo),
      destino,
      empilhar: paraVazio(empilhar),
    })),
  }
}
