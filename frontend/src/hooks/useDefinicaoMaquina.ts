import { useState } from 'react'
import type { Transicao } from '../api/tipos'
import {
  type CampoDefinicao,
  type DefinicaoMaquina,
  definicaoDeExemplo,
  definicaoVazia,
  novaTransicao,
} from '../maquina/definicao'

export interface EdicaoMaquina {
  alterarCampo: (campo: CampoDefinicao, valor: string) => void
  alterarTransicao: <C extends keyof Transicao>(id: string, campo: C, valor: Transicao[C]) => void
  adicionarTransicao: () => void
  removerTransicao: (id: string) => void
  carregarExemplo: () => void
  limpar: () => void
}

export function useDefinicaoMaquina(): { definicao: DefinicaoMaquina; edicao: EdicaoMaquina } {
  const [definicao, setDefinicao] = useState(definicaoDeExemplo)

  const edicao: EdicaoMaquina = {
    alterarCampo: (campo, valor) => setDefinicao((atual) => ({ ...atual, [campo]: valor })),
    alterarTransicao: (id, campo, valor) =>
      setDefinicao((atual) => ({
        ...atual,
        transicoes: atual.transicoes.map((transicao) =>
          transicao.id === id ? { ...transicao, [campo]: valor } : transicao,
        ),
      })),
    adicionarTransicao: () =>
      setDefinicao((atual) => ({ ...atual, transicoes: [...atual.transicoes, novaTransicao()] })),
    removerTransicao: (id) =>
      setDefinicao((atual) => ({
        ...atual,
        transicoes: atual.transicoes.filter((transicao) => transicao.id !== id),
      })),
    carregarExemplo: () => setDefinicao(definicaoDeExemplo()),
    limpar: () => setDefinicao(definicaoVazia()),
  }

  return { definicao, edicao }
}
