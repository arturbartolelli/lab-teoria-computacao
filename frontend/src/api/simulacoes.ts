import { numerarTransicoesNoErro } from '../maquina/formatacao'
import type { ResultadoSimulacao, SimulacaoRequest } from './tipos'

const ENDPOINT = '/api/simulacoes'

interface ProblemDetail {
  detail?: string
  erros?: string[]
}

export class ErroDeSimulacao extends Error {
  readonly detalhes: string[]

  constructor(mensagem: string, detalhes: string[] = []) {
    super(mensagem)
    this.name = 'ErroDeSimulacao'
    this.detalhes = detalhes
  }
}

export async function simular(requisicao: SimulacaoRequest): Promise<ResultadoSimulacao> {
  const resposta = await enviar(requisicao)
  if (!resposta.ok) {
    throw await erroDaResposta(resposta)
  }
  return resposta.json() as Promise<ResultadoSimulacao>
}

async function enviar(requisicao: SimulacaoRequest): Promise<Response> {
  try {
    return await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requisicao),
    })
  } catch {
    throw new ErroDeSimulacao('não foi possível conectar ao backend')
  }
}

async function erroDaResposta(resposta: Response): Promise<ErroDeSimulacao> {
  const problema = await lerProblema(resposta)
  if (!problema?.detail) {
    return new ErroDeSimulacao(`backend indisponível ou com falha (HTTP ${resposta.status})`)
  }
  return new ErroDeSimulacao(problema.detail, problema.erros?.map(numerarTransicoesNoErro))
}

async function lerProblema(resposta: Response): Promise<ProblemDetail | null> {
  try {
    return (await resposta.json()) as ProblemDetail
  } catch {
    return null
  }
}
