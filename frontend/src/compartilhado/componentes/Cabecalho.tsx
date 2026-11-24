import styles from './Cabecalho.module.css'

interface CabecalhoProps {
  comando: string
  descricao: string
}

export function Cabecalho({ comando, descricao }: CabecalhoProps) {
  return (
    <header className={styles.cabecalho}>
      <h1 className={styles.prompt}>
        <span className={styles.usuario}>aluno@unifor</span>:<span className={styles.caminho}>~/teoria-computacao</span>$ {comando}
        <span className={styles.cursor} aria-hidden="true" />
      </h1>
      <p className={styles.legenda}>{descricao}</p>
    </header>
  )
}
