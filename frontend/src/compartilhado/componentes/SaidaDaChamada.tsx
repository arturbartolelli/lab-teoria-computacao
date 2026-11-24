import { type ComponentType, memo } from 'react'
import type { ErroDaApi } from '../api/cliente'
import type { EstadoChamada } from '../hooks/useChamadaApi'
import styles from './SaidaDaChamada.module.css'

interface SaidaDaChamadaProps<T> {
  estado: EstadoChamada<T>
  Resultado: ComponentType<{ resultado: T }>
}

function Saida<T>({ estado, Resultado }: SaidaDaChamadaProps<T>) {
  switch (estado.fase) {
    case 'ociosa':
      return <p className={styles.aviso}>aguardando execução. preencha a definição e pressione [ executar ].</p>
    case 'executando':
      return <p className={styles.carregando}>processando</p>
    case 'falhou':
      return <MensagemDeErro erro={estado.erro} />
    case 'concluida':
      return <Resultado resultado={estado.resultado} />
  }
}

export const SaidaDaChamada = memo(Saida) as typeof Saida

function MensagemDeErro({ erro }: { erro: ErroDaApi }) {
  return (
    <div className={styles.erro} role="alert">
      <p className={styles.tituloErro}>erro: {erro.message}</p>
      {erro.detalhes.length > 0 && (
        <ul className={styles.detalhes}>
          {erro.detalhes.map((detalhe) => (
            <li key={detalhe}>{detalhe}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
