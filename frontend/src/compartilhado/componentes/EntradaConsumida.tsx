import styles from './EntradaConsumida.module.css'

interface EntradaConsumidaProps {
  cadeia: string
  consumidos: number
}

export function EntradaConsumida({ cadeia, consumidos }: EntradaConsumidaProps) {
  return (
    <p className={styles.entrada} aria-label={`entrada com ${consumidos} símbolos lidos`}>
      entrada ❯{' '}
      {cadeia === '' ? (
        <span className={styles.lido}>ε</span>
      ) : (
        cadeia.split('').map((simbolo, posicao) => (
          <span
            key={posicao}
            className={posicao < consumidos ? styles.lido : posicao === consumidos ? styles.atual : styles.pendente}
          >
            {simbolo}
          </span>
        ))
      )}
    </p>
  )
}
