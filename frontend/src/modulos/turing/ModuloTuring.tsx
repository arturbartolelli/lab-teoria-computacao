import { JanelaTerminal } from '../../compartilhado/componentes/JanelaTerminal'
import { SaidaDaChamada } from '../../compartilhado/componentes/SaidaDaChamada'
import { useChamadaApi } from '../../compartilhado/hooks/useChamadaApi'
import { useDefinicao } from '../../compartilhado/hooks/useDefinicao'
import { simularMaquinaTuring } from './api'
import { Reproducao } from './componentes/Reproducao'
import { FormularioMaquina } from './componentes/FormularioMaquina'
import { definicaoDeExemplo, montarRequisicao, transicaoVazia } from './definicao'

export function ModuloTuring() {
  const simulacao = useChamadaApi(simularMaquinaTuring)
  const { definicao, edicao } = useDefinicao(definicaoDeExemplo, transicaoVazia, simulacao.reiniciar)

  return (
    <>
      <JanelaTerminal titulo="~/turing/definicao.tm" rotulo="Definição da máquina de Turing">
        <FormularioMaquina
          definicao={definicao}
          edicao={edicao}
          executando={simulacao.executando}
          onExecutar={() => simulacao.executar(montarRequisicao(definicao))}
        />
      </JanelaTerminal>
      <JanelaTerminal titulo="~/turing/saida.log" rotulo="Resultado da simulação">
        <SaidaDaChamada estado={simulacao.estado} Resultado={Reproducao} />
      </JanelaTerminal>
    </>
  )
}
