import { type ComId, comId } from '../../compartilhado/hooks/useDefinicao'
import { comoObjeto, lista, listaDeTextos, texto } from '../../compartilhado/json'
import { EPSILON, exibirVazio, paraVazio, separarLista } from '../../compartilhado/formatacao'
import type { AutomatoFinitoRequest, TransicaoAutomato } from './tipos'

export interface DefinicaoAutomato {
  cadeia: string
  estados: string
  estadoInicial: string
  estadosFinais: string
  regras: ComId<TransicaoAutomato>[]
}

type TransicaoCompacta = [string, string, string]

interface Exemplo {
  cadeia: string
  estados: string
  estadoInicial: string
  estadosFinais: string
  transicoes: TransicaoCompacta[]
}

const EXEMPLOS = {
  'enunciado: q0 –a→ q1 –b→ q2': {
    cadeia: 'ab',
    estados: 'q0, q1, q2',
    estadoInicial: 'q0',
    estadosFinais: 'q2',
    transicoes: [
      ['q0', 'a', 'q1'],
      ['q1', 'b', 'q2'],
    ],
  },
  'AFD: contém bb': {
    cadeia: 'abba',
    estados: 'q0, q1, q2',
    estadoInicial: 'q0',
    estadosFinais: 'q2',
    transicoes: [
      ['q0', 'a', 'q0'],
      ['q0', 'b', 'q1'],
      ['q1', 'a', 'q0'],
      ['q1', 'b', 'q2'],
      ['q2', 'a', 'q2'],
      ['q2', 'b', 'q2'],
    ],
  },
  'AFN: contém aa ou bb': {
    cadeia: 'abb',
    estados: 'q0, q1, q2, q3',
    estadoInicial: 'q0',
    estadosFinais: 'q3',
    transicoes: [
      ['q0', 'a', 'q0'],
      ['q0', 'b', 'q0'],
      ['q0', 'a', 'q1'],
      ['q0', 'b', 'q2'],
      ['q1', 'a', 'q3'],
      ['q2', 'b', 'q3'],
      ['q3', 'a', 'q3'],
      ['q3', 'b', 'q3'],
    ],
  },
  'AFN com ε: contém 11 ou 101': {
    cadeia: '010110',
    estados: 'q1, q2, q3, q4',
    estadoInicial: 'q1',
    estadosFinais: 'q4',
    transicoes: [
      ['q1', '0', 'q1'],
      ['q1', '1', 'q1'],
      ['q1', '1', 'q2'],
      ['q2', '0', 'q3'],
      ['q2', EPSILON, 'q3'],
      ['q3', '1', 'q4'],
      ['q4', '0', 'q4'],
      ['q4', '1', 'q4'],
    ],
  },
} satisfies Record<string, Exemplo>

export type NomeExemplo = keyof typeof EXEMPLOS

export const NOMES_EXEMPLOS = Object.keys(EXEMPLOS) as NomeExemplo[]

export function transicaoVazia(): TransicaoAutomato {
  return { origem: '', simbolo: '', destino: '' }
}

export function definicaoDeExemplo(nome: NomeExemplo = 'enunciado: q0 –a→ q1 –b→ q2'): DefinicaoAutomato {
  const { transicoes, ...campos }: Exemplo = EXEMPLOS[nome]
  return {
    ...campos,
    regras: transicoes.map(([origem, simbolo, destino]) => comId({ origem, simbolo, destino })),
  }
}

export function definicaoVazia(): DefinicaoAutomato {
  return { cadeia: '', estados: '', estadoInicial: 'q0', estadosFinais: '', regras: [comId(transicaoVazia())] }
}

export function montarRequisicao(definicao: DefinicaoAutomato): AutomatoFinitoRequest {
  return {
    cadeia: paraVazio(definicao.cadeia),
    estados: separarLista(definicao.estados),
    estadoInicial: definicao.estadoInicial,
    estadosFinais: separarLista(definicao.estadosFinais),
    transicoes: definicao.regras.map(({ origem, simbolo, destino }) => ({
      origem,
      simbolo: paraVazio(simbolo),
      destino,
    })),
  }
}

export function paraDefinicao(dados: unknown): DefinicaoAutomato {
  const objeto = comoObjeto(dados)
  return {
    cadeia: texto(objeto, 'cadeia', ''),
    estados: listaDeTextos(objeto, 'estados').join(', '),
    estadoInicial: texto(objeto, 'estadoInicial'),
    estadosFinais: listaDeTextos(objeto, 'estadosFinais').join(', '),
    regras: lista(objeto, 'transicoes').map((transicao) =>
      comId({
        origem: texto(transicao, 'origem'),
        simbolo: exibirVazio(texto(transicao, 'simbolo')),
        destino: texto(transicao, 'destino'),
      }),
    ),
  }
}
