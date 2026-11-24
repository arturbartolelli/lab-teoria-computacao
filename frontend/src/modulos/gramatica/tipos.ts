export interface Producao {
  cabeca: string
  corpo: string
}

export interface GramaticaRequest {
  variaveis: string[]
  terminais: string[]
  simboloInicial: string
  producoes: Producao[]
  cadeia: string
}

export interface NoArvore {
  indice: number
  simbolo: string
  pai: number
}

export interface PassoDerivacao {
  numero: number
  formaSentencial: string
  producao: string | null
}

export interface ResultadoDerivacao {
  aceita: boolean
  cadeia: string
  producoes: string[]
  derivacao: PassoDerivacao[]
  arvore: NoArvore[]
}
