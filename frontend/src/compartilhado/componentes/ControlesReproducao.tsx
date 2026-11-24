import { useId } from 'react'
import { type Reproducao, type Velocidade, VELOCIDADES } from '../hooks/useReproducao'
import { BotaoTerminal } from './BotaoTerminal'
import styles from './ControlesReproducao.module.css'

const ROTULOS_VELOCIDADE: Record<Velocidade, string> = {
  lenta: 'lenta',
  normal: 'normal',
  rapida: 'rápida',
}

interface ControlesReproducaoProps {
  reproducao: Reproducao
}

export function ControlesReproducao({ reproducao }: ControlesReproducaoProps) {
  const { indice, ultimo, emReproducao } = reproducao
  const idLinhaDoTempo = useId()
  const idVelocidade = useId()

  return (
    <div className={styles.controles}>
      <div className={styles.botoes}>
        <BotaoTerminal aria-label="primeiro passo" disabled={indice === 0} onClick={() => reproducao.irPara(0)}>
          |&lt;
        </BotaoTerminal>
        <BotaoTerminal aria-label="passo anterior" disabled={indice === 0} onClick={reproducao.voltar}>
          &lt;
        </BotaoTerminal>
        <BotaoTerminal variante="primario" disabled={ultimo === 0} onClick={reproducao.alternar}>
          {emReproducao ? 'pausar' : 'reproduzir'}
        </BotaoTerminal>
        <BotaoTerminal aria-label="próximo passo" disabled={indice === ultimo} onClick={reproducao.avancar}>
          &gt;
        </BotaoTerminal>
        <BotaoTerminal aria-label="último passo" disabled={indice === ultimo} onClick={() => reproducao.irPara(ultimo)}>
          &gt;|
        </BotaoTerminal>
      </div>

      <div className={styles.linhaDoTempo}>
        <label htmlFor={idLinhaDoTempo} className={styles.contador}>
          passo {indice}/{ultimo}
        </label>
        <input
          id={idLinhaDoTempo}
          type="range"
          min={0}
          max={ultimo}
          value={indice}
          className={styles.barra}
          onChange={(evento) => reproducao.irPara(Number(evento.target.value))}
        />
        <label htmlFor={idVelocidade} className={styles.contador}>
          vel
        </label>
        <select
          id={idVelocidade}
          className={styles.velocidade}
          value={reproducao.velocidade}
          onChange={(evento) => reproducao.mudarVelocidade(evento.target.value as Velocidade)}
        >
          {VELOCIDADES.map((velocidade) => (
            <option key={velocidade} value={velocidade}>
              {ROTULOS_VELOCIDADE[velocidade]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
