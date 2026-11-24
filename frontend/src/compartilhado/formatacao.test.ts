import { describe, expect, it } from 'vitest'
import { exibirVazio, numerarItensNoErro, paraVazio, separarLista } from './formatacao'

describe('numerarItensNoErro', () => {
  it('converte o índice da API para a numeração exibida nas tabelas', () => {
    expect(numerarItensNoErro('transicoes[0].simbolo: inválido')).toBe('transicoes 01 › simbolo: inválido')
  })

  it('mantém mensagens de outros campos', () => {
    expect(numerarItensNoErro('cadeia: inválida')).toBe('cadeia: inválida')
  })
})

describe('símbolo vazio', () => {
  it('aceita ε e λ como cadeia vazia', () => {
    expect(paraVazio('ε')).toBe('')
    expect(paraVazio(' λ ')).toBe('')
    expect(paraVazio('a')).toBe('a')
  })

  it('exibe a cadeia vazia com a marca escolhida', () => {
    expect(exibirVazio('')).toBe('ε')
    expect(exibirVazio('', 'λ')).toBe('λ')
  })
})

describe('separarLista', () => {
  it('separa por vírgula ou espaço e remove duplicados', () => {
    expect(separarLista(' q3, q4  q3 ,')).toEqual(['q3', 'q4'])
  })
})
