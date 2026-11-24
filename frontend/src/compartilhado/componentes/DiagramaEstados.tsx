import { memo, useId } from 'react'
import { type Aresta, type Ponto, chaveDaAresta, layoutCircular } from '../diagrama'
import styles from './DiagramaEstados.module.css'

const RAIO_MINIMO_NO = 20
const LARGURA_POR_CARACTERE = 4
const FOLGA_DO_ROTULO = 8
const CURVATURA = 28
const ABERTURA_LACO = 0.45
const ALCANCE_LACO = 42
const COMPRIMENTO_SETA_INICIAL = 26
const GIRO_SETA_INICIAL = Math.PI / 2

interface DiagramaEstadosProps {
  estados: readonly string[]
  inicial: string
  finais: readonly string[]
  arestas: readonly Aresta[]
  ativos: readonly string[]
  destacadas: readonly string[]
}

export const DiagramaEstados = memo(function DiagramaEstados({
  estados,
  inicial,
  finais,
  arestas,
  ativos,
  destacadas,
}: DiagramaEstadosProps) {
  const prefixo = useId().replace(/[^a-zA-Z0-9]/g, '')
  const seta = `seta${prefixo}`
  const setaDestacada = `setaDestacada${prefixo}`
  const raio = raioDoNo(estados)
  const { tamanho, centro, posicoes } = layoutCircular(estados, raio)
  const geometria = { raio, centro }

  return (
    <svg className={styles.diagrama} viewBox={`0 0 ${tamanho} ${tamanho}`} role="img" aria-label="diagrama de estados">
      <defs>
        <Ponta id={seta} classe={styles.ponta} />
        <Ponta id={setaDestacada} classe={styles.pontaDestacada} />
      </defs>
      {arestas.map((aresta) => {
        const origem = posicoes.get(aresta.origem)
        const destino = posicoes.get(aresta.destino)
        if (!origem || !destino) {
          return null
        }
        const traco = aresta.origem === aresta.destino ? laco(origem, geometria) : curva(origem, destino, raio)
        const destacada = destacadas.includes(chaveDaAresta(aresta))
        return (
          <g key={chaveDaAresta(aresta)} className={destacada ? styles.arestaDestacada : styles.aresta}>
            <path d={traco.caminho} markerEnd={`url(#${destacada ? setaDestacada : seta})`} />
            <text x={traco.rotulo.x} y={traco.rotulo.y} textAnchor="middle" dominantBaseline="middle">
              {aresta.rotulo}
            </text>
          </g>
        )
      })}
      {estados.map((estado) => {
        const posicao = posicoes.get(estado)
        if (!posicao) {
          return null
        }
        const classes = [styles.no, ativos.includes(estado) && styles.ativo].filter(Boolean).join(' ')
        return (
          <g key={estado} className={classes}>
            {estado === inicial && <SetaInicial no={posicao} geometria={geometria} seta={seta} />}
            <circle cx={posicao.x} cy={posicao.y} r={raio} />
            {finais.includes(estado) && <circle cx={posicao.x} cy={posicao.y} r={raio - 4} />}
            <text x={posicao.x} y={posicao.y} textAnchor="middle" dominantBaseline="central">
              {estado}
            </text>
          </g>
        )
      })}
    </svg>
  )
})

interface Geometria {
  raio: number
  centro: Ponto
}

interface Traco {
  caminho: string
  rotulo: Ponto
}

function Ponta({ id, classe }: { id: string; classe: string | undefined }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="9"
      markerHeight="9"
      markerUnits="userSpaceOnUse"
      orient="auto"
    >
      <path d="M0,0 L10,5 L0,10 z" className={classe} />
    </marker>
  )
}

function SetaInicial({ no, geometria, seta }: { no: Ponto; geometria: Geometria; seta: string }) {
  const direcao = girar(saida(no, geometria.centro), GIRO_SETA_INICIAL)
  const inicio = deslocar(no, direcao, geometria.raio + COMPRIMENTO_SETA_INICIAL)
  const fim = deslocar(no, direcao, geometria.raio)
  return <line className={styles.inicial} x1={inicio.x} y1={inicio.y} x2={fim.x} y2={fim.y} markerEnd={`url(#${seta})`} />
}

function raioDoNo(estados: readonly string[]): number {
  const maiorNome = Math.max(0, ...estados.map((estado) => estado.length))
  return Math.max(RAIO_MINIMO_NO, maiorNome * LARGURA_POR_CARACTERE + FOLGA_DO_ROTULO)
}

function curva(origem: Ponto, destino: Ponto, raio: number): Traco {
  const distancia = Math.hypot(destino.x - origem.x, destino.y - origem.y) || 1
  const direcao = { x: (destino.x - origem.x) / distancia, y: (destino.y - origem.y) / distancia }
  const normal = { x: -direcao.y, y: direcao.x }
  const inicio = deslocar(origem, direcao, raio)
  const fim = deslocar(destino, direcao, -raio)
  const meio = { x: (origem.x + destino.x) / 2, y: (origem.y + destino.y) / 2 }
  const controle = deslocar(meio, normal, CURVATURA)
  return {
    caminho: `M${inicio.x},${inicio.y} Q${controle.x},${controle.y} ${fim.x},${fim.y}`,
    rotulo: deslocar(meio, normal, CURVATURA / 2 + 10),
  }
}

function laco(no: Ponto, { raio, centro }: Geometria): Traco {
  const externa = saida(no, centro)
  const inicio = deslocar(no, girar(externa, -ABERTURA_LACO), raio)
  const fim = deslocar(no, girar(externa, ABERTURA_LACO), raio)
  const controleIda = deslocar(no, girar(externa, -ABERTURA_LACO * 2), raio + ALCANCE_LACO)
  const controleVolta = deslocar(no, girar(externa, ABERTURA_LACO * 2), raio + ALCANCE_LACO)
  return {
    caminho: `M${inicio.x},${inicio.y} C${controleIda.x},${controleIda.y} ${controleVolta.x},${controleVolta.y} ${fim.x},${fim.y}`,
    rotulo: deslocar(no, externa, raio + ALCANCE_LACO),
  }
}

function saida(no: Ponto, centro: Ponto): Ponto {
  const distancia = Math.hypot(no.x - centro.x, no.y - centro.y)
  return distancia === 0 ? { x: 0, y: -1 } : { x: (no.x - centro.x) / distancia, y: (no.y - centro.y) / distancia }
}

function girar(vetor: Ponto, angulo: number): Ponto {
  return {
    x: vetor.x * Math.cos(angulo) - vetor.y * Math.sin(angulo),
    y: vetor.x * Math.sin(angulo) + vetor.y * Math.cos(angulo),
  }
}

function deslocar(ponto: Ponto, direcao: Ponto, distancia: number): Ponto {
  return { x: ponto.x + direcao.x * distancia, y: ponto.y + direcao.y * distancia }
}
