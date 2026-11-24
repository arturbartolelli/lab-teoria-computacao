export interface TransicaoPilha {
  origem: string
  simbolo: string
  topo: string
  destino: string
  empilhar: string
}

export interface AutomatoPilhaRequest {
  cadeia: string
  estadoInicial: string
  estadosFinais: string[]
  transicoes: TransicaoPilha[]
}

export type MotivoParadaPilha = 'ACEITA' | 'REJEITADA' | 'LIMITE_DE_COPIAS'

export interface PassoPilha {
  numero: number
  estado: string
  lido: string
  entradaRestante: string
  pilha: string
  transicao: TransicaoPilha | null
}

export interface ResultadoPilha {
  aceita: boolean
  motivo: MotivoParadaPilha
  passos: PassoPilha[]
  copias: number
}
