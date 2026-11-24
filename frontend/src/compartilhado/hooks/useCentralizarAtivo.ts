import { useEffect, useRef } from 'react'

type Eixo = 'horizontal' | 'vertical'

const FILHOS_DIRETOS = ':scope > *'

export function useCentralizarAtivo<T extends HTMLElement>(eixo: Eixo, indiceAtivo: number, seletor = FILHOS_DIRETOS) {
  const container = useRef<T>(null)

  useEffect(() => {
    const elemento = container.current
    const ativo = elemento?.querySelectorAll(seletor).item(indiceAtivo)
    if (!elemento || !(ativo instanceof HTMLElement)) {
      return
    }
    if (eixo === 'horizontal') {
      elemento.scrollTo({ left: ativo.offsetLeft - (elemento.clientWidth - ativo.offsetWidth) / 2, behavior: 'smooth' })
    } else {
      elemento.scrollTo({ top: ativo.offsetTop - (elemento.clientHeight - ativo.offsetHeight) / 2, behavior: 'smooth' })
    }
  }, [eixo, indiceAtivo, seletor])

  return container
}
