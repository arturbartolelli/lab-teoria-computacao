import { type ComId, comId } from '../../compartilhado/hooks/useDefinicao'
import { LAMBDA, paraVazio, separarLista } from '../../compartilhado/formatacao'
import type { GramaticaRequest, Producao } from './tipos'

export interface DefinicaoGramatica {
  variaveis: string
  terminais: string
  simboloInicial: string
  cadeia: string
  regras: ComId<Producao>[]
}

const SEPARADOR_DE_ALTERNATIVAS = '|'

interface Exemplo {
  variaveis: string
  terminais: string
  simboloInicial: string
  cadeia: string
  producoes: [string, string][]
}

const EXEMPLOS = {
  'enunciado: S → aSb | λ': {
    variaveis: 'S',
    terminais: 'a, b',
    simboloInicial: 'S',
    cadeia: 'aaabbb',
    producoes: [['S', `aSb | ${LAMBDA}`]],
  },
  'expressões aritméticas': {
    variaveis: 'E, X, T, Y, F',
    terminais: '+ * ( ) x',
    simboloInicial: 'E',
    cadeia: 'x+x*(x+x)',
    producoes: [
      ['E', 'TX'],
      ['X', `+TX | ${LAMBDA}`],
      ['T', 'FY'],
      ['Y', `*FY | ${LAMBDA}`],
      ['F', '(E) | x'],
    ],
  },
  'palíndromos sobre {a, b}': {
    variaveis: 'S',
    terminais: 'a, b',
    simboloInicial: 'S',
    cadeia: 'abbba',
    producoes: [['S', `aSa | bSb | a | b | ${LAMBDA}`]],
  },
  'parênteses balanceados': {
    variaveis: 'S',
    terminais: '( )',
    simboloInicial: 'S',
    cadeia: '(()())',
    producoes: [['S', `(S)S | ${LAMBDA}`]],
  },
} satisfies Record<string, Exemplo>

export type NomeExemplo = keyof typeof EXEMPLOS

export const NOMES_EXEMPLOS = Object.keys(EXEMPLOS) as NomeExemplo[]

export function producaoVazia(): Producao {
  return { cabeca: '', corpo: '' }
}

export function definicaoDeExemplo(nome: NomeExemplo = 'enunciado: S → aSb | λ'): DefinicaoGramatica {
  const { producoes, ...campos }: Exemplo = EXEMPLOS[nome]
  return { ...campos, regras: producoes.map(([cabeca, corpo]) => comId({ cabeca, corpo })) }
}

export function definicaoVazia(): DefinicaoGramatica {
  return { variaveis: 'S', terminais: '', simboloInicial: 'S', cadeia: '', regras: [comId(producaoVazia())] }
}

export function montarRequisicao(definicao: DefinicaoGramatica): GramaticaRequest {
  return {
    variaveis: separarLista(definicao.variaveis),
    terminais: separarLista(definicao.terminais),
    simboloInicial: definicao.simboloInicial.trim(),
    producoes: definicao.regras.map(({ cabeca, corpo }) => ({ cabeca: cabeca.trim(), corpo: paraCorpo(corpo) })),
    cadeia: paraVazio(definicao.cadeia),
  }
}

function paraCorpo(corpo: string): string {
  return corpo
    .split(SEPARADOR_DE_ALTERNATIVAS)
    .map((alternativa) => paraVazio(alternativa).replaceAll(' ', ''))
    .join(SEPARADOR_DE_ALTERNATIVAS)
}
