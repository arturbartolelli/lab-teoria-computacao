import { describe, expect, it } from 'vitest'
import { definicaoDeExemplo, montarRequisicao } from './definicao'

describe('autômato com pilha em JSON', () => {
  it('envia ε como texto vazio em leitura, topo e empilhamento', () => {
    const requisicao = montarRequisicao(definicaoDeExemplo())

    expect(requisicao.transicoes[0]).toEqual({ origem: 'q1', simbolo: '', topo: '', destino: 'q2', empilhar: '$' })
    expect(requisicao.transicoes[2]).toEqual({ origem: 'q2', simbolo: 'b', topo: 'a', destino: 'q3', empilhar: '' })
  })
})
