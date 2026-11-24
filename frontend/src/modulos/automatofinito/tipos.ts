export interface TransicaoAutomato {
  origem: string
  simbolo: string
  destino: string
}

export interface AutomatoFinitoRequest {
  cadeia: string
  estados: string[]
  estadoInicial: string
  estadosFinais: string[]
  transicoes: TransicaoAutomato[]
}

export type TipoAutomato = 'AFD' | 'AFN'

export interface PassoAutomato {
  numero: number
  simbolo: string
  estadosAnteriores: string[]
  estadosAtuais: string[]
  transicoes: TransicaoAutomato[]
  transicoesVazias: TransicaoAutomato[]
}

export interface ResultadoAutomato {
  cadeia: string
  tipo: TipoAutomato
  aceita: boolean
  estados: string[]
  estadoInicial: string
  estadosFinais: string[]
  transicoes: TransicaoAutomato[]
  estadosIniciaisAtivos: string[]
  transicoesVaziasIniciais: TransicaoAutomato[]
  passos: PassoAutomato[]
  simbolosConsumidos: number
}
