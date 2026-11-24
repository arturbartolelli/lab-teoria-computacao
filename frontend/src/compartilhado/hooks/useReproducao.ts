import { useCallback, useEffect, useState } from 'react'

export type Velocidade = 'lenta' | 'normal' | 'rapida'

export const VELOCIDADES: readonly Velocidade[] = ['lenta', 'normal', 'rapida']

const INTERVALO_MS: Record<Velocidade, number> = {
  lenta: 700,
  normal: 300,
  rapida: 60,
}

export interface Reproducao {
  indice: number
  ultimo: number
  emReproducao: boolean
  velocidade: Velocidade
  irPara: (indice: number) => void
  avancar: () => void
  voltar: () => void
  alternar: () => void
  mudarVelocidade: (velocidade: Velocidade) => void
}

export function useReproducao(totalQuadros: number): Reproducao {
  const ultimo = totalQuadros - 1
  const [indice, setIndice] = useState(0)
  const [tocando, setTocando] = useState(false)
  const [velocidade, setVelocidade] = useState<Velocidade>('normal')
  const emReproducao = tocando && indice < ultimo

  useEffect(() => {
    if (!emReproducao) {
      return
    }
    const temporizador = setInterval(() => setIndice((atual) => Math.min(atual + 1, ultimo)), INTERVALO_MS[velocidade])
    return () => clearInterval(temporizador)
  }, [emReproducao, ultimo, velocidade])

  const irPara = useCallback(
    (destino: number) => {
      setTocando(false)
      setIndice(Math.min(Math.max(destino, 0), ultimo))
    },
    [ultimo],
  )

  function alternar() {
    if (emReproducao) {
      setTocando(false)
      return
    }
    if (indice >= ultimo) {
      setIndice(0)
    }
    setTocando(true)
  }

  return {
    indice,
    ultimo,
    emReproducao,
    velocidade,
    irPara,
    avancar: () => irPara(indice + 1),
    voltar: () => irPara(indice - 1),
    alternar,
    mudarVelocidade: setVelocidade,
  }
}
