export interface Ponto {
  x: number
  y: number
}

export interface Aresta {
  origem: string
  destino: string
  rotulo: string
}

const MARGEM = 70
const RAIO_MINIMO = 70
const ESPACO_ENTRE_NOS = 3.2

export function chaveDaAresta({ origem, destino }: Pick<Aresta, 'origem' | 'destino'>): string {
  return `${origem}→${destino}`
}

export function agruparArestas(arestas: readonly Aresta[]): Aresta[] {
  const agrupadas = new Map<string, Aresta>()
  for (const aresta of arestas) {
    const chave = chaveDaAresta(aresta)
    const existente = agrupadas.get(chave)
    agrupadas.set(chave, existente ? { ...existente, rotulo: `${existente.rotulo}, ${aresta.rotulo}` } : aresta)
  }
  return [...agrupadas.values()]
}

export function layoutCircular(estados: readonly string[], raioDoNo: number) {
  const raio = estados.length <= 1 ? 0 : Math.max(RAIO_MINIMO, (estados.length * raioDoNo * ESPACO_ENTRE_NOS) / (2 * Math.PI))
  const tamanho = 2 * (raio + MARGEM)
  const centro = { x: tamanho / 2, y: tamanho / 2 }
  const posicoes = new Map<string, Ponto>(
    estados.map((estado, indice) => {
      const angulo = -Math.PI / 2 + (2 * Math.PI * indice) / estados.length
      return [estado, { x: centro.x + raio * Math.cos(angulo), y: centro.y + raio * Math.sin(angulo) }]
    }),
  )
  return { tamanho, centro, posicoes }
}
