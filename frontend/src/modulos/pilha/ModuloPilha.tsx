import { postar } from '../../compartilhado/api/cliente'
import { CampoPrompt } from '../../compartilhado/componentes/CampoPrompt'
import { FormularioModelo } from '../../compartilhado/componentes/FormularioModelo'
import { JanelaTerminal } from '../../compartilhado/componentes/JanelaTerminal'
import { SaidaDaChamada } from '../../compartilhado/componentes/SaidaDaChamada'
import { type Segmento, TabelaDeRegras } from '../../compartilhado/componentes/TabelaDeRegras'
import { useChamadaApi } from '../../compartilhado/hooks/useChamadaApi'
import { useDefinicao } from '../../compartilhado/hooks/useDefinicao'
import estilos from '../../compartilhado/componentes/Formulario.module.css'
import { ReproducaoPilha } from './ReproducaoPilha'
import {
  NOMES_EXEMPLOS,
  type NomeExemplo,
  definicaoDeExemplo,
  definicaoVazia,
  montarRequisicao,
  transicaoVazia,
} from './definicao'
import type { AutomatoPilhaRequest, ResultadoPilha, TransicaoPilha } from './tipos'

const SEGMENTOS: Segmento<TransicaoPilha>[] = [
  'δ(',
  { campo: 'origem', rotulo: 'estado de origem', largura: 'estado', placeholder: 'q0' },
  ',',
  { campo: 'simbolo', rotulo: 'símbolo lido', largura: 'caractere', placeholder: 'ε', maximo: 1 },
  ',',
  { campo: 'topo', rotulo: 'topo desempilhado', largura: 'caractere', placeholder: 'ε', maximo: 1 },
  ') = (',
  { campo: 'destino', rotulo: 'estado de destino', largura: 'estado', placeholder: 'q1' },
  ',',
  { campo: 'empilhar', rotulo: 'símbolo empilhado', largura: 'caractere', placeholder: 'ε', maximo: 1 },
  ')',
]

function simular(requisicao: AutomatoPilhaRequest): Promise<ResultadoPilha> {
  return postar('/api/automatos-pilha/simulacoes', requisicao)
}

export function ModuloPilha() {
  const simulacao = useChamadaApi(simular)
  const { definicao, edicao } = useDefinicao(definicaoDeExemplo, transicaoVazia, simulacao.reiniciar)

  return (
    <>
      <JanelaTerminal titulo="~/pilha/definicao.ap" rotulo="Definição do autômato com pilha">
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
              placeholder="aaabbb (vazio = ε)"
              onAlterar={(valor) => edicao.alterarCampo('cadeia', valor)}
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
              placeholder="q4"
              onAlterar={(valor) => edicao.alterarCampo('estadosFinais', valor)}
            />
          </div>
          <TabelaDeRegras
            legenda="transições"
            formato="δ(estado, lido, topo) = (destino, empilha) · vazio = ε"
            nomeDaRegra="transição"
            regras={definicao.regras}
            segmentos={SEGMENTOS}
            onAlterar={edicao.alterarRegra}
            onRemover={edicao.removerRegra}
          />
        </FormularioModelo>
      </JanelaTerminal>
      <JanelaTerminal titulo="~/pilha/saida.log" rotulo="Resultado da simulação">
        <SaidaDaChamada estado={simulacao.estado} Resultado={ReproducaoPilha} />
      </JanelaTerminal>
    </>
  )
}
