import type { ReactNode } from 'react'
import styles from './JanelaTerminal.module.css'

interface JanelaTerminalProps {
  titulo: string
  rotulo: string
  children: ReactNode
}

export function JanelaTerminal({ titulo, rotulo, children }: JanelaTerminalProps) {
  return (
    <section className={styles.janela} aria-label={rotulo}>
      <div className={styles.barra}>
        <span className={styles.luzes} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.titulo} aria-hidden="true">
          {titulo}
        </span>
      </div>
      <div className={styles.conteudo}>{children}</div>
    </section>
  )
}
