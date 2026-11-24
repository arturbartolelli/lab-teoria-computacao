export const DIRECOES = ['R', 'L'] as const

export type Direcao = (typeof DIRECOES)[number]

export interface Transicao {
  estadoAtual: string
  simboloLido: string
  novoEstado: string
  simboloEscrito: string
  direcao: Direcao
}

export interface SimulacaoRequest {
  cadeia: string
  estadoInicial: string
  estadosFinais: string[]
  transicoes: Transicao[]
}

export type MotivoParada = 'ESTADO_FINAL' | 'SEM_TRANSICAO' | 'LIMITE_DE_PASSOS'

export interface Quadro {
  estado: string
  fita: string
  cabecote: number
}

export interface Passo extends Quadro {
  numero: number
  transicao: Transicao
}

export interface ResultadoSimulacao {
  aceita: boolean
  motivo: MotivoParada
  estadoDeParada: string
  fitaFinal: string
  cabecoteFinal: number
  passos: Passo[]
}
