import { describe, expect, it } from 'vitest'
import { numerarTransicoesNoErro } from './formatacao'

describe('numerarTransicoesNoErro', () => {
  it('converte o índice da API para a numeração exibida na tabela', () => {
    expect(numerarTransicoesNoErro('transicoes[0].simboloLido: inválido')).toBe(
      'transição 01 › simboloLido: inválido',
    )
  })

  it('mantém mensagens de outros campos', () => {
    expect(numerarTransicoesNoErro('cadeia: inválida')).toBe('cadeia: inválida')
  })
})
