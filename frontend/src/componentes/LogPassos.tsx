import { memo } from 'react'
import type { Passo } from '../api/tipos'
import { useCentralizarAtivo } from '../hooks/useCentralizarAtivo'
import { DIGITOS_PASSO, formatarIndice, formatarTransicao } from '../maquina/formatacao'
import styles from './LogPassos.module.css'

interface LogPassosProps {
  passos: Passo[]
  atual: number
  onSelecionar: (indice: number) => void
}

export function LogPassos({ passos, atual, onSelecionar }: LogPassosProps) {
  const log = useCentralizarAtivo<HTMLOListElement>('vertical', atual)
  const indiceParada = passos.length

  return (
    <ol ref={log} className={styles.log} aria-label="log de passos">
      {passos.map((passo) => (
        <LinhaLog
          key={passo.numero}
          indice={passo.numero}
          ativa={passo.numero === atual}
          texto={formatarTransicao(passo.transicao)}
          onSelecionar={onSelecionar}
        />
      ))}
      <LinhaLog indice={indiceParada} ativa={indiceParada === atual} texto="halt" onSelecionar={onSelecionar} />
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
