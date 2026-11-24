import { describe, expect, it } from 'vitest'
import type { ResultadoSimulacao } from './tipos'
import { classificar, descreverParada, montarQuadros } from './veredito'

const passo = {
  numero: 0,
  estado: 'q0',
  fita: 'B0B',
  cabecote: 1,
  transicao: { estadoAtual: 'q0', simboloLido: '0', novoEstado: 'q1', simboloEscrito: '1', direcao: 'R' as const },
}

const rejeitada: ResultadoSimulacao = {
  aceita: false,
  motivo: 'SEM_TRANSICAO',
  estadoDeParada: 'q1',
  fitaFinal: 'B1B',
  cabecoteFinal: 2,
  passos: [passo],
}

describe('descreverParada', () => {
  it('informa a configuração sem transição', () => {
    expect(descreverParada(rejeitada)).toBe('nenhuma transição para δ(q1, B) após 1 passo(s)')
  })

  it('informa o estado final alcançado', () => {
    const aceita = { ...rejeitada, aceita: true, motivo: 'ESTADO_FINAL' as const }

    expect(descreverParada(aceita)).toBe('estado final q1 alcançado em 1 passo(s)')
  })
})

describe('classificar', () => {
  it('não trata o limite de passos como rejeição', () => {
    expect(classificar({ ...rejeitada, motivo: 'LIMITE_DE_PASSOS' }).titulo).toBe('INDETERMINADA')
  })

  it('rejeita quando falta transição', () => {
    expect(classificar(rejeitada).titulo).toBe('REJEITADA')
  })
})

describe('montarQuadros', () => {
  it('acrescenta a configuração final depois dos passos', () => {
    expect(montarQuadros(rejeitada)).toEqual([passo, { estado: 'q1', fita: 'B1B', cabecote: 2 }])
  })
})
