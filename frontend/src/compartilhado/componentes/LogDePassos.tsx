import { memo } from 'react'
import { useCentralizarAtivo } from '../hooks/useCentralizarAtivo'
import { DIGITOS_PASSO, formatarIndice } from '../formatacao'
import styles from './LogDePassos.module.css'

interface LogDePassosProps {
  linhas: string[]
  atual: number
  onSelecionar: (indice: number) => void
}

export function LogDePassos({ linhas, atual, onSelecionar }: LogDePassosProps) {
  const log = useCentralizarAtivo<HTMLOListElement>('vertical', atual)

  return (
    <ol ref={log} className={styles.log} aria-label="log de passos">
      {linhas.map((texto, indice) => (
        <LinhaLog key={indice} indice={indice} ativa={indice === atual} texto={texto} onSelecionar={onSelecionar} />
      ))}
    </ol>
  )
}

interface LinhaLogProps {
  indice: number
  ativa: boolean
  texto: string
  onSelecionar: (indice: number) => void
}

const LinhaLog = memo(function LinhaLog({ indice, ativa, texto, onSelecionar }: LinhaLogProps) {
  return (
    <li>
      <button
        type="button"
        className={ativa ? `${styles.linha} ${styles.ativa}` : styles.linha}
        aria-current={ativa ? 'step' : undefined}
        onClick={() => onSelecionar(indice)}
      >
        <span className={styles.numero}>{formatarIndice(indice, DIGITOS_PASSO)}</span>
        {texto}
      </button>
    </li>
  )
})
