import styles from './Veredito.module.css'

export type Tom = 'positivo' | 'negativo' | 'neutro'

interface VereditoProps {
  tom: Tom
  titulo: string
  descricao: string
}

export function Veredito({ tom, titulo, descricao }: VereditoProps) {
  return (
    <p className={`${styles.veredito} ${styles[tom]}`} role="status">
      <strong>&gt;&gt; {titulo}</strong>
      <span className={styles.descricao}>{descricao}</span>
    </p>
  )
}
