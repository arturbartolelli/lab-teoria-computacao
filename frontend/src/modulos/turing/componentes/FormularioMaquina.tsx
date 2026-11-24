import { CampoPrompt } from '../../../compartilhado/componentes/CampoPrompt'
import { FormularioModelo } from '../../../compartilhado/componentes/FormularioModelo'
import { type Segmento, TabelaDeRegras } from '../../../compartilhado/componentes/TabelaDeRegras'
import type { EdicaoDefinicao } from '../../../compartilhado/hooks/useDefinicao'
import estilos from '../../../compartilhado/componentes/Formulario.module.css'
import {
  type DefinicaoMaquina,
  NOMES_EXEMPLOS,
  type NomeExemplo,
  definicaoDeExemplo,
  definicaoVazia,
} from '../definicao'
import { DIRECOES, type Transicao } from '../tipos'

const SEGMENTOS: Segmento<Transicao>[] = [
  'δ(',
  { campo: 'estadoAtual', rotulo: 'estado atual', largura: 'estado', placeholder: 'q0' },
  ',',
  { campo: 'simboloLido', rotulo: 'símbolo lido', largura: 'caractere', placeholder: '0', maximo: 1 },
  ') = (',
  { campo: 'novoEstado', rotulo: 'novo estado', largura: 'estado', placeholder: 'q1' },
  ',',
  { campo: 'simboloEscrito', rotulo: 'símbolo escrito', largura: 'caractere', placeholder: '1', maximo: 1 },
  ',',
  { campo: 'direcao', rotulo: 'direção', opcoes: DIRECOES },
  ')',
]

interface FormularioMaquinaProps {
  definicao: DefinicaoMaquina
  edicao: EdicaoDefinicao<DefinicaoMaquina, Transicao>
  executando: boolean
  onExecutar: () => void
}

export function FormularioMaquina({ definicao, edicao, executando, onExecutar }: FormularioMaquinaProps) {
  return (
    <FormularioModelo
      executando={executando}
      exemplos={NOMES_EXEMPLOS}
      rotuloAdicionar="transição"
      onExecutar={onExecutar}
      onAdicionar={edicao.adicionarRegra}
      onExemplo={(nome) => edicao.carregar(definicaoDeExemplo(nome as NomeExemplo))}
      onLimpar={() => edicao.carregar(definicaoVazia())}
    >
      <div className={estilos.campos}>
        <CampoPrompt
          rotulo="cadeia"
          valor={definicao.cadeia}
          placeholder="ex: 000100 (vazio = ε)"
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
          placeholder="q3, q4"
          onAlterar={(valor) => edicao.alterarCampo('estadosFinais', valor)}
        />
      </div>
      <TabelaDeRegras
        legenda="transições"
        formato="δ(estado, lido) = (novo, escreve, R | L)"
        nomeDaRegra="transição"
        regras={definicao.regras}
        segmentos={SEGMENTOS}
        onAlterar={edicao.alterarRegra}
        onRemover={edicao.removerRegra}
      />
    </FormularioModelo>
  )
}
