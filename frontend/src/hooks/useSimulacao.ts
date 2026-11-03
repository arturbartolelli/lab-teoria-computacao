import { useState } from 'react'
import { ErroDeSimulacao, simular } from '../api/simulacoes'
import type { ResultadoSimulacao, SimulacaoRequest } from '../api/tipos'

export type EstadoSimulacao =
  | { fase: 'ociosa' }
  | { fase: 'executando' }
  | { fase: 'concluida'; resultado: ResultadoSimulacao }
  | { fase: 'falhou'; erro: ErroDeSimulacao }

export function useSimulacao() {
  const [estado, setEstado] = useState<EstadoSimulacao>({ fase: 'ociosa' })

  async function executar(requisicao: SimulacaoRequest) {
    setEstado({ fase: 'executando' })
    try {
      const resultado = await simular(requisicao)
      setEstado({ fase: 'concluida', resultado })
    } catch (erro) {
      setEstado({ fase: 'falhou', erro: paraErroDeSimulacao(erro) })
    }
  }

  return { estado, executar }
}

function paraErroDeSimulacao(erro: unknown): ErroDeSimulacao {
  if (erro instanceof ErroDeSimulacao) {
    return erro
  }
  return new ErroDeSimulacao(erro instanceof Error ? erro.message : 'erro inesperado')
}
