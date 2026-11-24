import { postar } from '../../compartilhado/api/cliente'
import { CampoPrompt } from '../../compartilhado/componentes/CampoPrompt'
import { FormularioModelo } from '../../compartilhado/componentes/FormularioModelo'
import { JanelaTerminal } from '../../compartilhado/componentes/JanelaTerminal'
import { SaidaDaChamada } from '../../compartilhado/componentes/SaidaDaChamada'
import { type Segmento, TabelaDeRegras } from '../../compartilhado/componentes/TabelaDeRegras'
import { useChamadaApi } from '../../compartilhado/hooks/useChamadaApi'
import { useDefinicao } from '../../compartilhado/hooks/useDefinicao'
import estilos from '../../compartilhado/componentes/Formulario.module.css'
import { ResultadoGramatica } from './ResultadoGramatica'
import {
  NOMES_EXEMPLOS,
  type NomeExemplo,
  definicaoDeExemplo,
  definicaoVazia,
  montarRequisicao,
  producaoVazia,
} from './definicao'
import type { GramaticaRequest, Producao, ResultadoDerivacao } from './tipos'

const SEGMENTOS: Segmento<Producao>[] = [
  { campo: 'cabeca', rotulo: 'variável', largura: 'caractere', placeholder: 'S', maximo: 1 },
  '→',
  { campo: 'corpo', rotulo: 'corpo', largura: 'palavra', placeholder: 'aSb | λ' },
]

function derivar(requisicao: GramaticaRequest): Promise<ResultadoDerivacao> {
  return postar('/api/gramaticas/derivacoes', requisicao)
}

export function ModuloGramatica() {
  const derivacao = useChamadaApi(derivar)
  const { definicao, edicao } = useDefinicao(definicaoDeExemplo, producaoVazia, derivacao.reiniciar)

  return (
    <>
      <JanelaTerminal titulo="~/gramaticas/definicao.glc" rotulo="Definição da gramática">
        <FormularioModelo
          executando={derivacao.executando}
          exemplos={NOMES_EXEMPLOS}
          rotuloAdicionar="produção"
          onExecutar={() => derivacao.executar(montarRequisicao(definicao))}
          onAdicionar={edicao.adicionarRegra}
          onExemplo={(nome) => edicao.carregar(definicaoDeExemplo(nome as NomeExemplo))}
          onLimpar={() => edicao.carregar(definicaoVazia())}
        >
          <div className={estilos.campos}>
            <CampoPrompt
              rotulo="V"
              valor={definicao.variaveis}
              placeholder="S, A"
              onAlterar={(valor) => edicao.alterarCampo('variaveis', valor)}
            />
            <CampoPrompt
              rotulo="T"
              valor={definicao.terminais}
              placeholder="a, b"
              onAlterar={(valor) => edicao.alterarCampo('terminais', valor)}
            />
            <CampoPrompt
              rotulo="inicial"
              valor={definicao.simboloInicial}
              placeholder="S"
              onAlterar={(valor) => edicao.alterarCampo('simboloInicial', valor)}
            />
            <CampoPrompt
              rotulo="cadeia"
              valor={definicao.cadeia}
              placeholder="aaabbb (vazio = λ)"
              onAlterar={(valor) => edicao.alterarCampo('cadeia', valor)}
            />
          </div>
          <TabelaDeRegras
            legenda="produções"
            formato="A → α | β · corpo vazio = λ"
            nomeDaRegra="produção"
            regras={definicao.regras}
            segmentos={SEGMENTOS}
            onAlterar={edicao.alterarRegra}
            onRemover={edicao.removerRegra}
          />
        </FormularioModelo>
      </JanelaTerminal>
      <JanelaTerminal titulo="~/gramaticas/saida.log" rotulo="Resultado da derivação">
        <SaidaDaChamada estado={derivacao.estado} Resultado={ResultadoGramatica} />
      </JanelaTerminal>
    </>
  )
}
