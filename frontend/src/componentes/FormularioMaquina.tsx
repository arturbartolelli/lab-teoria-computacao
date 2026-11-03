import type { FormEvent } from 'react'
import type { EdicaoMaquina } from '../hooks/useDefinicaoMaquina'
import type { DefinicaoMaquina } from '../maquina/definicao'
import { BotaoTerminal } from './BotaoTerminal'
import { CampoPrompt } from './CampoPrompt'
import { TabelaTransicoes } from './TabelaTransicoes'
import styles from './FormularioMaquina.module.css'

interface FormularioMaquinaProps {
  definicao: DefinicaoMaquina
  edicao: EdicaoMaquina
  executando: boolean
  onExecutar: () => void
}

export function FormularioMaquina({ definicao, edicao, executando, onExecutar }: FormularioMaquinaProps) {
  function submeter(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    onExecutar()
  }

  return (
    <form className={styles.formulario} onSubmit={submeter}>
      <div className={styles.campos}>
        <CampoPrompt
          rotulo="cadeia"
          valor={definicao.cadeia}
          placeholder="ex: 0001001 (vazio = ε)"
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

      <TabelaTransicoes
        transicoes={definicao.transicoes}
        onAlterar={edicao.alterarTransicao}
        onRemover={edicao.removerTransicao}
      />

      <div className={styles.acoes}>
        <BotaoTerminal type="submit" variante="primario" disabled={executando}>
          {executando ? 'executando…' : 'executar'}
        </BotaoTerminal>
        <BotaoTerminal onClick={edicao.adicionarTransicao}>+ transição</BotaoTerminal>
        <BotaoTerminal onClick={edicao.carregarExemplo}>exemplo</BotaoTerminal>
        <BotaoTerminal variante="perigo" onClick={edicao.limpar}>
          limpar
        </BotaoTerminal>
      </div>
    </form>
  )
}
