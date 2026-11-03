import { memo } from 'react'
import type { ErroDeSimulacao } from '../api/simulacoes'
import type { EstadoSimulacao } from '../hooks/useSimulacao'
import { Reproducao } from './Reproducao'
import styles from './Saida.module.css'

interface SaidaProps {
  estado: EstadoSimulacao
}

export const Saida = memo(function Saida({ estado }: SaidaProps) {
  switch (estado.fase) {
    case 'ociosa':
      return <p className={styles.aviso}>aguardando execução. defina a máquina e pressione [ executar ].</p>
    case 'executando':
      return <p className={styles.carregando}>simulando</p>
    case 'falhou':
      return <MensagemDeErro erro={estado.erro} />
    case 'concluida':
      return <Reproducao resultado={estado.resultado} />
  }
})

function MensagemDeErro({ erro }: { erro: ErroDeSimulacao }) {
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
