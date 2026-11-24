import { useEffect } from 'react'
import styles from './Abas.module.css'

export interface Aba {
  id: string
  rotulo: string
}

interface AbasProps {
  abas: readonly Aba[]
  ativa: string
}

export function Abas({ abas, ativa }: AbasProps) {
  useEffect(() => {
    function trocarPorAtalho(evento: KeyboardEvent) {
      const aba = evento.altKey ? abas[Number(evento.key) - 1] : undefined
      if (aba) {
        evento.preventDefault()
        window.location.hash = aba.id
      }
    }
    window.addEventListener('keydown', trocarPorAtalho)
    return () => window.removeEventListener('keydown', trocarPorAtalho)
  }, [abas])

  return (
    <nav className={styles.abas} aria-label="módulos (atalho: Alt + número)">
      {abas.map((aba, indice) => (
        <a
          key={aba.id}
          href={`#${aba.id}`}
          className={aba.id === ativa ? `${styles.aba} ${styles.ativa}` : styles.aba}
          aria-current={aba.id === ativa ? 'page' : undefined}
          aria-keyshortcuts={`Alt+${indice + 1}`}
          title={`Alt + ${indice + 1}`}
        >
          <span className={styles.atalho}>{indice + 1}</span>
          {aba.rotulo}
        </a>
      ))}
    </nav>
  )
}
