import { useState } from 'react'

export type Regra<R> = { [K in keyof R]: string }

export type ComId<R> = R & { id: string }

interface DefinicaoComRegras<R> {
  regras: ComId<R>[]
}

export function comId<R>(regra: R): ComId<R> {
  return { ...regra, id: crypto.randomUUID() }
}

export function semId<R>(regras: ComId<R>[]): R[] {
  return regras.map(({ id: _id, ...regra }) => regra as R)
}

export interface EdicaoDefinicao<D, R> {
  alterarCampo: <K extends Exclude<keyof D, 'regras'>>(campo: K, valor: D[K]) => void
  alterarRegra: (id: string, campo: keyof R, valor: string) => void
  adicionarRegra: () => void
  removerRegra: (id: string) => void
  carregar: (definicao: D) => void
}

export function useDefinicao<D extends DefinicaoComRegras<R>, R extends Regra<R>>(
  criar: () => D,
  regraVazia: () => R,
  aoCarregar: () => void,
): { definicao: D; edicao: EdicaoDefinicao<D, R> } {
  const [definicao, setDefinicao] = useState(criar)

  const edicao: EdicaoDefinicao<D, R> = {
    alterarCampo: (campo, valor) => setDefinicao((atual) => ({ ...atual, [campo]: valor })),
    alterarRegra: (id, campo, valor) =>
      setDefinicao((atual) => ({
        ...atual,
        regras: atual.regras.map((regra) => (regra.id === id ? { ...regra, [campo]: valor } : regra)),
      })),
    adicionarRegra: () => setDefinicao((atual) => ({ ...atual, regras: [...atual.regras, comId(regraVazia())] })),
    removerRegra: (id) =>
      setDefinicao((atual) => ({ ...atual, regras: atual.regras.filter((regra) => regra.id !== id) })),
    carregar: (nova) => {
      setDefinicao(nova)
      aoCarregar()
    },
  }

  return { definicao, edicao }
}
