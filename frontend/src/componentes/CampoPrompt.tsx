import { useId } from 'react'
import styles from './CampoPrompt.module.css'

interface CampoPromptProps {
  rotulo: string
  valor: string
  placeholder?: string
  onAlterar: (valor: string) => void
}

export function CampoPrompt({ rotulo, valor, placeholder, onAlterar }: CampoPromptProps) {
  const id = useId()

  return (
    <div className={styles.campo}>
      <label htmlFor={id} className={styles.rotulo}>
        {rotulo}
        <span className={styles.seta} aria-hidden="true">
          ❯
        </span>
      </label>
      <input
        id={id}
        className={styles.entrada}
        value={valor}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        onChange={(evento) => onAlterar(evento.target.value)}
      />
    </div>
  )
}
