import { numerarItensNoErro } from '../formatacao'

interface ProblemDetail {
  detail?: string
  erros?: string[]
}

export class ErroDaApi extends Error {
  readonly detalhes: string[]

  constructor(mensagem: string, detalhes: string[] = []) {
    super(mensagem)
    this.name = 'ErroDaApi'
    this.detalhes = detalhes
  }
}

export async function postar<T>(endpoint: string, corpo: unknown): Promise<T> {
  const resposta = await enviar(endpoint, corpo)
  if (!resposta.ok) {
    throw await erroDaResposta(resposta)
  }
  return resposta.json() as Promise<T>
}

async function enviar(endpoint: string, corpo: unknown): Promise<Response> {
  try {
    return await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
    })
  } catch {
    throw new ErroDaApi('não foi possível conectar ao backend')
  }
}

async function erroDaResposta(resposta: Response): Promise<ErroDaApi> {
  const problema = await lerProblema(resposta)
  if (!problema?.detail) {
    return new ErroDaApi(`backend indisponível ou com falha (HTTP ${resposta.status})`)
  }
  return new ErroDaApi(problema.detail, problema.erros?.map(numerarItensNoErro))
}

async function lerProblema(resposta: Response): Promise<ProblemDetail | null> {
  try {
    return (await resposta.json()) as ProblemDetail
  } catch {
    return null
  }
}
