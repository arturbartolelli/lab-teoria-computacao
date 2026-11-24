import { postar } from '../../compartilhado/api/cliente'
import { CampoPrompt } from '../../compartilhado/componentes/CampoPrompt'
import { FormularioModelo } from '../../compartilhado/componentes/FormularioModelo'
import { JanelaTerminal } from '../../compartilhado/componentes/JanelaTerminal'
import { PainelJson } from '../../compartilhado/componentes/PainelJson'
import { SaidaDaChamada } from '../../compartilhado/componentes/SaidaDaChamada'
import { type Segmento, TabelaDeRegras } from '../../compartilhado/componentes/TabelaDeRegras'
import { useChamadaApi } from '../../compartilhado/hooks/useChamadaApi'
import { useDefinicao } from '../../compartilhado/hooks/useDefinicao'
import estilos from '../../compartilhado/componentes/Formulario.module.css'
import { ReproducaoAutomato } from './ReproducaoAutomato'
import {
  NOMES_EXEMPLOS,
  type NomeExemplo,
  definicaoDeExemplo,
  definicaoVazia,
  montarRequisicao,
  paraDefinicao,
  transicaoVazia,
} from './definicao'
import type { AutomatoFinitoRequest, ResultadoAutomato, TransicaoAutomato } from './tipos'

const SEGMENTOS: Segmento<TransicaoAutomato>[] = [
  'δ(',
  { campo: 'origem', rotulo: 'estado de origem', largura: 'estado', placeholder: 'q0' },
  ',',
  { campo: 'simbolo', rotulo: 'símbolo', largura: 'caractere', placeholder: 'ε', maximo: 1 },
  ') =',
  { campo: 'destino', rotulo: 'estado de destino', largura: 'estado', placeholder: 'q1' },
]

function simular(requisicao: AutomatoFinitoRequest): Promise<ResultadoAutomato> {
  return postar('/api/automatos-finitos/simulacoes', requisicao)
}

export function ModuloAutomatoFinito() {
  const simulacao = useChamadaApi(simular)
  const { definicao, edicao } = useDefinicao(definicaoDeExemplo, transicaoVazia, simulacao.reiniciar)

  return (
    <>
      <JanelaTerminal titulo="~/automatos/definicao.af" rotulo="Definição do autômato finito">
        <FormularioModelo
          executando={simulacao.executando}
          exemplos={NOMES_EXEMPLOS}
          rotuloAdicionar="transição"
          onExecutar={() => simulacao.executar(montarRequisicao(definicao))}
          onAdicionar={edicao.adicionarRegra}
          onExemplo={(nome) => edicao.carregar(definicaoDeExemplo(nome as NomeExemplo))}
          onLimpar={() => edicao.carregar(definicaoVazia())}
        >
          <div className={estilos.campos}>
            <CampoPrompt
              rotulo="cadeia"
              valor={definicao.cadeia}
              placeholder="ab (vazio = ε)"
              onAlterar={(valor) => edicao.alterarCampo('cadeia', valor)}
            />
            <CampoPrompt
              rotulo="estados"
              valor={definicao.estados}
              placeholder="q0, q1, q2"
              onAlterar={(valor) => edicao.alterarCampo('estados', valor)}
            />
            <CampoPrompt
              rotulo="inicial"
              valor={definicao.estadoInicial}
              placeholder="q0"
              onAlterar={(valor) => edicao.alterarCampo('estadoInicial', valor)}
            />
            <CampoPrompt
              rotulo="finais"
              valor={definicao.estadosFinais}
              placeholder="q2"
              onAlterar={(valor) => edicao.alterarCampo('estadosFinais', valor)}
            />
          </div>
          <TabelaDeRegras
            legenda="transições"
            formato="δ(estado, símbolo) = destino · símbolo vazio = ε"
            nomeDaRegra="transição"
            regras={definicao.regras}
            segmentos={SEGMENTOS}
            onAlterar={edicao.alterarRegra}
            onRemover={edicao.removerRegra}
          />
          <PainelJson
            nomeDoArquivo="automato-finito.json"
            atual={montarRequisicao(definicao)}
            onCarregar={(dados) => edicao.carregar(paraDefinicao(dados))}
          />
        </FormularioModelo>
      </JanelaTerminal>
      <JanelaTerminal titulo="~/automatos/saida.log" rotulo="Resultado da simulação">
        <SaidaDaChamada estado={simulacao.estado} Resultado={ReproducaoAutomato} />
      </JanelaTerminal>
    </>
  )
}
