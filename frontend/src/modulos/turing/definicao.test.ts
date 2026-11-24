import { describe, expect, it } from 'vitest'
import { definicaoDeExemplo, montarRequisicao } from './definicao'

describe('montarRequisicao', () => {
  it('separa estados finais e remove identificadores internos', () => {
    const definicao = { ...definicaoDeExemplo(), estadosFinais: ' q3, q4  q3 ,' }
    const requisicao = montarRequisicao(definicao)

    expect(requisicao.estadosFinais).toEqual(['q3', 'q4'])
    expect(requisicao.transicoes[0]).toEqual({
      estadoAtual: 'q0',
      simboloLido: '0',
      novoEstado: 'q0',
      simboloEscrito: '0',
      direcao: 'R',
    })
  })
})
