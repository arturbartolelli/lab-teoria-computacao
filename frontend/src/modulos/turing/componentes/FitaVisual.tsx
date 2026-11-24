import { memo } from 'react'
import type { Quadro } from '../tipos'
import { useCentralizarAtivo } from '../../../compartilhado/hooks/useCentralizarAtivo'
import styles from './FitaVisual.module.css'

const BRANCO = 'B'

interface FitaVisualProps {
  quadro: Quadro
}

export const FitaVisual = memo(function FitaVisual({ quadro }: FitaVisualProps) {
  const trilho = useCentralizarAtivo<HTMLOListElement>('horizontal', quadro.cabecote)

  return (
    <ol ref={trilho} className={styles.fita} aria-label={`fita com cabeçote na posição ${quadro.cabecote}`}>
      {quadro.fita.split('').map((simbolo, posicao) => {
        const sobCabecote = posicao === quadro.cabecote
        const classes = [styles.celula, simbolo === BRANCO && styles.branco, sobCabecote && styles.ativa]
        return (
          <li key={posicao} className={classes.filter(Boolean).join(' ')}>
            <span className={styles.simbolo}>{simbolo}</span>
            {sobCabecote && <span className={styles.cabecote}>▲ {quadro.estado}</span>}
          </li>
        )
      })}
    </ol>
  )
})
