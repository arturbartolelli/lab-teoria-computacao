import styles from './Cabecalho.module.css'

const LOGO = [
  '┌┬┐┬ ┬┬─┐┬┌┐┌┌─┐',
  ' │ │ │├┬┘│││││ ┬',
  ' ┴ └─┘┴└─┴┘└┘└─┘',
].join('\n')

export function Cabecalho() {
  return (
    <header className={styles.cabecalho}>
      <pre className={styles.logo} aria-hidden="true">
        {LOGO}
      </pre>
      <h1 className={styles.prompt} aria-label="Simulador de Máquina de Turing">
        <span className={styles.usuario}>turing@unifor</span>:<span className={styles.caminho}>~</span>$ ./simulador
        <span className={styles.cursor} aria-hidden="true" />
      </h1>
      <p className={styles.legenda}>máquina de turing determinística · fita infinita · branco = B</p>
    </header>
  )
}
