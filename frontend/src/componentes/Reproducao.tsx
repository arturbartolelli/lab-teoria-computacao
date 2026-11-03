import { useMemo } from 'react'
import type { ResultadoSimulacao } from '../api/tipos'
import { useReproducao } from '../hooks/useReproducao'
import { formatarTransicao } from '../maquina/formatacao'
import { type Veredito, classificar, descreverParada, montarQuadros } from '../maquina/veredito'
import { ControlesReproducao } from './ControlesReproducao'
import { FitaVisual } from './FitaVisual'
import { LogPassos } from './LogPassos'
import styles from './Reproducao.module.css'

const ESTILO_DO_VEREDITO: Record<Veredito, string | undefined> = {
  ACEITA: styles.aceita,
  REJEITADA: styles.rejeitada,
  INDETERMINADA: styles.indeterminada,
}

interface ReproducaoProps {
  resultado: ResultadoSimulacao
}

export function Reproducao({ resultado }: ReproducaoProps) {
  const quadros = useMemo(() => montarQuadros(resultado), [resultado])
  const reproducao = useReproducao(quadros.length)
  const quadro = quadros[reproducao.indice]
  const proximaTransicao = resultado.passos[reproducao.indice]?.transicao
  const veredito = classificar(resultado)

  return (
    <div className={styles.reproducao}>
      <p className={`${styles.veredito} ${ESTILO_DO_VEREDITO[veredito]}`} role="status">
        <strong>&gt;&gt; {veredito}</strong>
        <span className={styles.motivo}>{descreverParada(resultado)}</span>
      </p>

      {quadro && <FitaVisual quadro={quadro} />}

      <p className={styles.proxima}>
        {proximaTransicao ? `próxima: ${formatarTransicao(proximaTransicao)}` : 'máquina parada'}
      </p>

      <ControlesReproducao reproducao={reproducao} />
      <LogPassos passos={resultado.passos} atual={reproducao.indice} onSelecionar={reproducao.irPara} />
    </div>
  )
}
