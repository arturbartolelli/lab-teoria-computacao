import { describe, expect, it } from 'vitest'
import { definicaoDeExemplo, montarRequisicao, paraDefinicao } from './definicao'

describe('autômato finito em JSON', () => {
  it('envia ε como símbolo vazio', () => {
    const requisicao = montarRequisicao(definicaoDeExemplo('AFN com ε: contém 11 ou 101'))

    expect(requisicao.transicoes[4]).toEqual({ origem: 'q2', simbolo: '', destino: 'q3' })
    expect(requisicao.estadosFinais).toEqual(['q4'])
  })

  it('carrega o JSON exportado sem perder informação', () => {
    const original = montarRequisicao(definicaoDeExemplo('AFN com ε: contém 11 ou 101'))

    expect(montarRequisicao(paraDefinicao(JSON.parse(JSON.stringify(original))))).toEqual(original)
  })

  it('recusa JSON que não é objeto', () => {
    expect(() => paraDefinicao([])).toThrow('JSON deve ser um objeto')
  })

  it('aponta o campo que falta no JSON', () => {
    expect(() => paraDefinicao({})).toThrow('falta o campo "estados"')
    expect(() =>
      paraDefinicao({ estados: ['s0'], estadoInicial: 's0', estadosFinais: ['s0'], transicoes: [{ de: 's0' }] }),
    ).toThrow('falta o campo "origem"')
  })
})
