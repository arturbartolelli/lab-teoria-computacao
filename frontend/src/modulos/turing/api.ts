import { postar } from '../../compartilhado/api/cliente'
import type { ResultadoSimulacao, SimulacaoRequest } from './tipos'

export function simularMaquinaTuring(requisicao: SimulacaoRequest): Promise<ResultadoSimulacao> {
  return postar('/api/maquinas-turing/simulacoes', requisicao)
}
