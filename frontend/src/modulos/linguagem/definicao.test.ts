import { describe, expect, it } from 'vitest'
import { definicaoDeExemplo, montarRequisicao } from './definicao'

describe('montarRequisicao', () => {
  it('converte λ na palavra vazia e separa os símbolos de Σ', () => {
    const requisicao = montarRequisicao(definicaoDeExemplo())

    expect(requisicao.alfabeto).toEqual(['a', 'b'])
    expect(requisicao.linguagem).toEqual(['ab', 'abba', ''])
    expect(requisicao.tamanhoMaximo).toBe(3)
  })
})
