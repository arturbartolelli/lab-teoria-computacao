import { paraVazio, separarLista } from '../../compartilhado/formatacao'
import type { AnaliseLinguagemRequest } from './tipos'

export interface DefinicaoLinguagem {
  alfabeto: string
  linguagem: string
  cadeia: string
  segundaCadeia: string
  tamanhoMaximo: string
}

const EXEMPLOS = {
  'enunciado: Σ = {a, b} e w = abba': {
    alfabeto: 'a, b',
    linguagem: 'ab, abba, λ',
    cadeia: 'abba',
    segundaCadeia: 'ab',
    tamanhoMaximo: '3',
  },
  'cadeia com símbolo fora de Σ': {
    alfabeto: 'a, b',
    linguagem: 'a, b',
    cadeia: 'abca',
    segundaCadeia: 'b',
    tamanhoMaximo: '2',
  },
  'L: começa com a e tem tamanho par': {
    alfabeto: 'a, b',
    linguagem: 'aa, ab, aaaa, aaab, aaba, aabb, abaa, abab, abba, abbb',
    cadeia: 'aaab',
    segundaCadeia: 'ab',
    tamanhoMaximo: '4',
  },
  'concatenação: ab · ca = abca': {
    alfabeto: 'a, b, c',
    linguagem: 'ab, ca',
    cadeia: 'ab',
    segundaCadeia: 'ca',
    tamanhoMaximo: '2',
  },
} satisfies Record<string, DefinicaoLinguagem>

export type NomeExemplo = keyof typeof EXEMPLOS

export const NOMES_EXEMPLOS = Object.keys(EXEMPLOS) as NomeExemplo[]

export function definicaoDeExemplo(nome: NomeExemplo = 'enunciado: Σ = {a, b} e w = abba'): DefinicaoLinguagem {
  return { ...EXEMPLOS[nome] }
}

export function definicaoVazia(): DefinicaoLinguagem {
  return { alfabeto: '', linguagem: '', cadeia: '', segundaCadeia: '', tamanhoMaximo: '2' }
}

export function montarRequisicao(definicao: DefinicaoLinguagem): AnaliseLinguagemRequest {
  return {
    alfabeto: separarLista(definicao.alfabeto),
    linguagem: separarLista(definicao.linguagem).map(paraVazio),
    cadeia: paraVazio(definicao.cadeia),
    segundaCadeia: paraVazio(definicao.segundaCadeia),
    tamanhoMaximo: Number(definicao.tamanhoMaximo.trim() || 0),
  }
}
