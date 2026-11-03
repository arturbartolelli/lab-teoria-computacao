import { describe, expect, it } from 'vitest'
import { definicaoDeExemplo, montarRequisicao, novaTransicao } from './definicao'

describe('montarRequisicao', () => {
  it('separa estados finais por vírgula ou espaço e remove duplicados', () => {
    const definicao = { ...definicaoDeExemplo(), estadosFinais: ' q3, q4  q3 ,' }

    expect(montarRequisicao(definicao).estadosFinais).toEqual(['q3', 'q4'])
  })

  it('remove o identificador interno das transições', () => {
    const transicao = novaTransicao({
      estadoAtual: 'q0',
      simboloLido: '0',
      novoEstado: 'q1',
      simboloEscrito: '1',
      direcao: 'L',
    })
    const definicao = { ...definicaoDeExemplo(), transicoes: [transicao] }

    expect(montarRequisicao(definicao).transicoes).toEqual([
      { estadoAtual: 'q0', simboloLido: '0', novoEstado: 'q1', simboloEscrito: '1', direcao: 'L' },
    ])
  })
})
