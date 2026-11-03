import { Cabecalho } from './componentes/Cabecalho'
import { FormularioMaquina } from './componentes/FormularioMaquina'
import { JanelaTerminal } from './componentes/JanelaTerminal'
import { Saida } from './componentes/Saida'
import { useDefinicaoMaquina } from './hooks/useDefinicaoMaquina'
import { useSimulacao } from './hooks/useSimulacao'
import { montarRequisicao } from './maquina/definicao'
import styles from './App.module.css'

export function App() {
  const { definicao, edicao } = useDefinicaoMaquina()
  const simulacao = useSimulacao()

  return (
    <main className={styles.layout}>
      <Cabecalho />
      <JanelaTerminal titulo="~/definicao.tm" rotulo="Definição da máquina">
        <FormularioMaquina
          definicao={definicao}
          edicao={edicao}
          executando={simulacao.estado.fase === 'executando'}
          onExecutar={() => simulacao.executar(montarRequisicao(definicao))}
        />
      </JanelaTerminal>
      <JanelaTerminal titulo="~/saida.log" rotulo="Resultado da simulação">
        <Saida estado={simulacao.estado} />
      </JanelaTerminal>
    </main>
  )
}
