import type { ButtonHTMLAttributes } from 'react'
import styles from './BotaoTerminal.module.css'

type Variante = 'padrao' | 'primario' | 'perigo'

interface BotaoTerminalProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
}

export function BotaoTerminal({ variante = 'padrao', type = 'button', className, ...props }: BotaoTerminalProps) {
  const classes = [styles.botao, styles[variante], className].filter(Boolean).join(' ')
  return <button type={type} className={classes} {...props} />
}
