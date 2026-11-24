import { type FormEvent, type ReactNode, useId } from 'react'
import { BotaoTerminal } from './BotaoTerminal'
import styles from './Formulario.module.css'

interface FormularioModeloProps {
  executando: boolean
  exemplos: readonly string[]
  rotuloAdicionar?: string
  onExecutar: () => void
  onAdicionar?: () => void
  onExemplo: (nome: string) => void
  onLimpar: () => void
  children: ReactNode
}

export function FormularioModelo({
  executando,
  exemplos,
  rotuloAdicionar,
  onExecutar,
  onAdicionar,
  onExemplo,
  onLimpar,
  children,
}: FormularioModeloProps) {
  const idExemplo = useId()

  function submeter(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    onExecutar()
  }

  return (
    <form className={styles.formulario} onSubmit={submeter}>
      {children}
      <div className={styles.acoes}>
        <BotaoTerminal type="submit" variante="primario" disabled={executando}>
          {executando ? 'executando…' : 'executar'}
        </BotaoTerminal>
        {onAdicionar && rotuloAdicionar && <BotaoTerminal onClick={onAdicionar}>+ {rotuloAdicionar}</BotaoTerminal>}
        <BotaoTerminal variante="perigo" onClick={onLimpar}>
          limpar
        </BotaoTerminal>
      </div>
      <div className={styles.exemplos}>
        <label htmlFor={idExemplo}>exemplo ❯</label>
        <select
          id={idExemplo}
          className={styles.selecao}
          value=""
          onChange={(evento) => onExemplo(evento.target.value)}
        >
          <option value="" disabled>
            carregar exemplo…
          </option>
          {exemplos.map((nome) => (
            <option key={nome} value={nome}>
              {nome}
            </option>
          ))}
        </select>
      </div>
    </form>
  )
}
