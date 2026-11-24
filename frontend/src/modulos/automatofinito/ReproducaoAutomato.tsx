import { useMemo } from 'react'
import { ControlesReproducao } from '../../compartilhado/componentes/ControlesReproducao'
import { DiagramaEstados } from '../../compartilhado/componentes/DiagramaEstados'
import { EntradaConsumida } from '../../compartilhado/componentes/EntradaConsumida'
import { LogDePassos } from '../../compartilhado/componentes/LogDePassos'
import { Veredito } from '../../compartilhado/componentes/Veredito'
import { agruparArestas } from '../../compartilhado/diagrama'
import { exibirVazio } from '../../compartilhado/formatacao'
import { useReproducao } from '../../compartilhado/hooks/useReproducao'
import { caminho, linhasDoLog, montarQuadros } from './reproducao'
import type { ResultadoAutomato } from './tipos'
import styles from './ReproducaoAutomato.module.css'

interface ReproducaoAutomatoProps {
  resultado: ResultadoAutomato
}

export function ReproducaoAutomato({ resultado }: ReproducaoAutomatoProps) {
  const quadros = useMemo(() => montarQuadros(resultado), [resultado])
  const linhas = useMemo(() => linhasDoLog(resultado), [resultado])
  const arestas = useMemo(
    () =>
      agruparArestas(
        resultado.transicoes.map(({ origem, destino, simbolo }) => ({ origem, destino, rotulo: exibirVazio(simbolo) })),
      ),
    [resultado],
  )
  const reproducao = useReproducao(quadros.length)
  const quadro = quadros[reproducao.indice]

  return (
    <div className={styles.reproducao}>
      <Veredito
        tom={resultado.aceita ? 'positivo' : 'negativo'}
        titulo={resultado.aceita ? 'ACEITA' : 'REJEITADA'}
        descricao={`${resultado.tipo} · ${caminho(resultado)}`}
      />
      {quadro && (
        <>
          <EntradaConsumida cadeia={resultado.cadeia} consumidos={quadro.consumidos} />
          <DiagramaEstados
            estados={resultado.estados}
            inicial={resultado.estadoInicial}
            finais={resultado.estadosFinais}
            arestas={arestas}
            ativos={quadro.ativos}
            destacadas={quadro.destacadas}
          />
        </>
      )}
      <ControlesReproducao reproducao={reproducao} />
      <LogDePassos linhas={linhas} atual={reproducao.indice} onSelecionar={reproducao.irPara} />
    </div>
  )
}
