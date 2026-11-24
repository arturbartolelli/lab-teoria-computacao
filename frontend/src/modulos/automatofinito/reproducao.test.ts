import { describe, expect, it } from 'vitest'
import { caminho, linhasDoLog, montarQuadros } from './reproducao'
import type { ResultadoAutomato } from './tipos'

const resultado: ResultadoAutomato = {
  cadeia: 'ab',
  tipo: 'AFD',
  aceita: true,
  estados: ['q0', 'q1', 'q2'],
  estadoInicial: 'q0',
  estadosFinais: ['q2'],
  transicoes: [],
  estadosIniciaisAtivos: ['q0'],
  transicoesVaziasIniciais: [],
  passos: [
    { numero: 1, simbolo: 'a', estadosAnteriores: ['q0'], estadosAtuais: ['q1'], transicoes: [], transicoesVazias: [] },
    { numero: 2, simbolo: 'b', estadosAnteriores: ['q1'], estadosAtuais: ['q2'], transicoes: [], transicoesVazias: [] },
  ],
  simbolosConsumidos: 2,
}

describe('caminho do autômato', () => {
  it('segue o formato do enunciado para AFD', () => {
    expect(caminho(resultado)).toBe('q0 → q1 → q2')
  })

  it('mostra conjuntos de estados para AFN', () => {
    expect(caminho({ ...resultado, tipo: 'AFN' })).toBe('{q0} → {q1} → {q2}')
  })

  it('descreve cada transição no log', () => {
    expect(linhasDoLog(resultado)).toEqual(['início em q0', 'δ(q0, a) = q1', 'δ(q1, b) = q2'])
  })

  it('mostra e destaca as transições ε usadas', () => {
    const comVazias: ResultadoAutomato = {
      ...resultado,
      tipo: 'AFN',
      estadosIniciaisAtivos: ['q0', 'q1'],
      transicoesVaziasIniciais: [{ origem: 'q0', simbolo: '', destino: 'q1' }],
      passos: [],
    }

    expect(linhasDoLog(comVazias)).toEqual(['início em {q0, q1} · por ε: q0 → q1'])
    expect(montarQuadros(comVazias)[0]?.destacadas).toEqual(['q0→q1'])
  })
})
