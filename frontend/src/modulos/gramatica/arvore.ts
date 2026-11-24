import type { NoArvore } from './tipos'

const RAMO = '├── '
const ULTIMO_RAMO = '└── '
const CONTINUACAO = '│   '
const RECUO = '    '

export function desenharArvore(nos: readonly NoArvore[]): string[] {
  const raiz = nos[0]
  if (!raiz) {
    return []
  }
  const filhos = new Map<number, NoArvore[]>()
  for (const no of nos) {
    filhos.set(no.pai, [...(filhos.get(no.pai) ?? []), no])
  }
  const desenhar = (no: NoArvore): string[] => {
    const descendentes = filhos.get(no.indice) ?? []
    return [
      no.simbolo,
      ...descendentes.flatMap((filho, indice) => {
        const ultimo = indice === descendentes.length - 1
        const [primeira = '', ...demais] = desenhar(filho)
        return [(ultimo ? ULTIMO_RAMO : RAMO) + primeira, ...demais.map((linha) => (ultimo ? RECUO : CONTINUACAO) + linha)]
      }),
    ]
  }
  return desenhar(raiz)
}
