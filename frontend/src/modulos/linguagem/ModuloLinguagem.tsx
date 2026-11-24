import { useState } from 'react'
import { postar } from '../../compartilhado/api/cliente'
import { CampoPrompt } from '../../compartilhado/componentes/CampoPrompt'
import { FormularioModelo } from '../../compartilhado/componentes/FormularioModelo'
import { JanelaTerminal } from '../../compartilhado/componentes/JanelaTerminal'
import { SaidaDaChamada } from '../../compartilhado/componentes/SaidaDaChamada'
import { useChamadaApi } from '../../compartilhado/hooks/useChamadaApi'
import estilos from '../../compartilhado/componentes/Formulario.module.css'
import { ResultadoLinguagem } from './ResultadoLinguagem'
import {
  type DefinicaoLinguagem,
  NOMES_EXEMPLOS,
  type NomeExemplo,
  definicaoDeExemplo,
  definicaoVazia,
  montarRequisicao,
} from './definicao'
import type { AnaliseLinguagem, AnaliseLinguagemRequest } from './tipos'

function analisar(requisicao: AnaliseLinguagemRequest): Promise<AnaliseLinguagem> {
  return postar('/api/linguagens/analises', requisicao)
}

export function ModuloLinguagem() {
  const [definicao, setDefinicao] = useState(definicaoDeExemplo)
  const analise = useChamadaApi(analisar)
  const alterar = (campo: keyof DefinicaoLinguagem) => (valor: string) =>
    setDefinicao((atual) => ({ ...atual, [campo]: valor }))
  const carregar = (nova: DefinicaoLinguagem) => {
    setDefinicao(nova)
    analise.reiniciar()
  }

  return (
    <>
      <JanelaTerminal titulo="~/linguagens/definicao.txt" rotulo="Definição da linguagem">
        <FormularioModelo
          executando={analise.executando}
          exemplos={NOMES_EXEMPLOS}
          onExecutar={() => analise.executar(montarRequisicao(definicao))}
          onExemplo={(nome) => carregar(definicaoDeExemplo(nome as NomeExemplo))}
          onLimpar={() => carregar(definicaoVazia())}
        >
          <div className={estilos.campos}>
            <CampoPrompt rotulo="Σ" valor={definicao.alfabeto} placeholder="a, b" onAlterar={alterar('alfabeto')} />
            <CampoPrompt rotulo="L" valor={definicao.linguagem} placeholder="ab, abba, λ" onAlterar={alterar('linguagem')} />
            <CampoPrompt rotulo="w" valor={definicao.cadeia} placeholder="abba (vazio = λ)" onAlterar={alterar('cadeia')} />
            <CampoPrompt rotulo="v" valor={definicao.segundaCadeia} placeholder="cadeia para w·v" onAlterar={alterar('segundaCadeia')} />
            <CampoPrompt rotulo="n" valor={definicao.tamanhoMaximo} placeholder="tamanho máximo em Σ* e Σ⁺ (0 a 10)" onAlterar={alterar('tamanhoMaximo')} />
          </div>
        </FormularioModelo>
      </JanelaTerminal>
      <JanelaTerminal titulo="~/linguagens/saida.log" rotulo="Resultado da análise">
        <SaidaDaChamada estado={analise.estado} Resultado={ResultadoLinguagem} />
      </JanelaTerminal>
    </>
  )
}
