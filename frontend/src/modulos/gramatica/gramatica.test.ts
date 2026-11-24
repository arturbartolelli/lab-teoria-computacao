import { describe, expect, it } from 'vitest'
import { desenharArvore } from './arvore'
import { definicaoDeExemplo, montarRequisicao } from './definicao'

describe('montarRequisicao', () => {
  it('mantém uma produção por linha e converte λ em alternativa vazia', () => {
    const requisicao = montarRequisicao(definicaoDeExemplo())

    expect(requisicao.producoes).toEqual([{ cabeca: 'S', corpo: 'aSb|' }])
  })
})

describe('desenharArvore', () => {
  it('desenha a árvore de derivação a partir da lista plana', () => {
    const nos = [
      { indice: 0, simbolo: 'S', pai: -1 },
      { indice: 1, simbolo: 'a', pai: 0 },
      { indice: 2, simbolo: 'S', pai: 0 },
      { indice: 3, simbolo: 'λ', pai: 2 },
      { indice: 4, simbolo: 'b', pai: 0 },
    ]

    expect(desenharArvore(nos)).toEqual(['S', '├── a', '├── S', '│   └── λ', '└── b'])
  })
})
