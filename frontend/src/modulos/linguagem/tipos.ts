export interface AnaliseLinguagemRequest {
  alfabeto: string[]
  linguagem: string[]
  cadeia: string
  segundaCadeia: string
  tamanhoMaximo: number
}

export interface SimboloInvalido {
  posicao: number
  simbolo: string
}

export interface AnaliseLinguagem {
  alfabeto: string[]
  linguagem: string[]
  cadeia: string
  cadeiaValida: boolean
  simbolosInvalidos: SimboloInvalido[]
  tamanho: number
  pertenceALinguagem: boolean
  segundaCadeia: string
  segundaCadeiaValida: boolean
  concatenacao: string
  tamanhoConcatenacao: number
  tamanhoMaximoEnumerado: number
  fechoKleene: string[]
  fechoPositivo: string[]
}
