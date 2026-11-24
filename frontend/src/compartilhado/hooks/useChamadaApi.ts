import { useState } from 'react'
import { ErroDaApi } from '../api/cliente'

export type EstadoChamada<T> =
  | { fase: 'ociosa' }
  | { fase: 'executando' }
  | { fase: 'concluida'; resultado: T }
  | { fase: 'falhou'; erro: ErroDaApi }

export function useChamadaApi<P, R>(chamar: (parametros: P) => Promise<R>) {
  const [estado, setEstado] = useState<EstadoChamada<R>>({ fase: 'ociosa' })

  async function executar(parametros: P) {
    setEstado({ fase: 'executando' })
    try {
      setEstado({ fase: 'concluida', resultado: await chamar(parametros) })
    } catch (erro) {
      setEstado({ fase: 'falhou', erro: paraErroDaApi(erro) })
    }
  }

  function reiniciar() {
    setEstado({ fase: 'ociosa' })
  }

  return { estado, executar, reiniciar, executando: estado.fase === 'executando' }
}

function paraErroDaApi(erro: unknown): ErroDaApi {
  if (erro instanceof ErroDaApi) {
    return erro
  }
  return new ErroDaApi(erro instanceof Error ? erro.message : 'erro inesperado')
}
