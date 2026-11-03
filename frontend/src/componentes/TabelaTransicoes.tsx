import { DIRECOES, type Direcao, type Transicao } from '../api/tipos'
import type { EdicaoMaquina } from '../hooks/useDefinicaoMaquina'
import type { TransicaoEditavel } from '../maquina/definicao'
import { DIGITOS_TRANSICAO, formatarIndice } from '../maquina/formatacao'
import styles from './TabelaTransicoes.module.css'

interface TabelaTransicoesProps {
  transicoes: TransicaoEditavel[]
  onAlterar: EdicaoMaquina['alterarTransicao']
  onRemover: (id: string) => void
}

export function TabelaTransicoes({ transicoes, onAlterar, onRemover }: TabelaTransicoesProps) {
  return (
    <fieldset className={styles.tabela}>
      <legend className={styles.legenda}>
        transições <span className={styles.formato}>δ(estado, lido) = (novo, escreve, direção)</span>
      </legend>
      {transicoes.length === 0 && <p className={styles.vazio}>nenhuma transição. use [ + transição ].</p>}
      <ol className={styles.lista}>
        {transicoes.map((transicao, posicao) => (
          <LinhaTransicao
            key={transicao.id}
            numero={posicao + 1}
            transicao={transicao}
            onAlterar={(campo, valor) => onAlterar(transicao.id, campo, valor)}
            onRemover={() => onRemover(transicao.id)}
          />
        ))}
      </ol>
    </fieldset>
  )
}

interface LinhaTransicaoProps {
  numero: number
  transicao: Transicao
  onAlterar: <C extends keyof Transicao>(campo: C, valor: Transicao[C]) => void
  onRemover: () => void
}

function LinhaTransicao({ numero, transicao, onAlterar, onRemover }: LinhaTransicaoProps) {
  const descricao = `transição ${numero}`

  return (
    <li className={styles.linha}>
      <span className={styles.numero}>{formatarIndice(numero, DIGITOS_TRANSICAO)}</span>
      <span className={styles.simbolo}>δ(</span>
      <input
        className={styles.estado}
        aria-label={`estado atual da ${descricao}`}
        value={transicao.estadoAtual}
        placeholder="q0"
        spellCheck={false}
        onChange={(evento) => onAlterar('estadoAtual', evento.target.value)}
      />
      <span className={styles.simbolo}>,</span>
      <input
        className={styles.caractere}
        aria-label={`símbolo lido da ${descricao}`}
        value={transicao.simboloLido}
        maxLength={1}
        placeholder="0"
        onChange={(evento) => onAlterar('simboloLido', evento.target.value)}
      />
      <span className={styles.simbolo}>) = (</span>
      <input
        className={styles.estado}
        aria-label={`novo estado da ${descricao}`}
        value={transicao.novoEstado}
        placeholder="q1"
        spellCheck={false}
        onChange={(evento) => onAlterar('novoEstado', evento.target.value)}
      />
      <span className={styles.simbolo}>,</span>
      <input
        className={styles.caractere}
        aria-label={`símbolo escrito da ${descricao}`}
        value={transicao.simboloEscrito}
        maxLength={1}
        placeholder="1"
        onChange={(evento) => onAlterar('simboloEscrito', evento.target.value)}
      />
      <span className={styles.simbolo}>,</span>
      <select
        className={styles.direcao}
        aria-label={`direção da ${descricao}`}
        value={transicao.direcao}
        onChange={(evento) => onAlterar('direcao', evento.target.value as Direcao)}
      >
        {DIRECOES.map((direcao) => (
          <option key={direcao} value={direcao}>
            {direcao}
          </option>
        ))}
      </select>
      <span className={styles.simbolo}>)</span>
      <button type="button" className={styles.remover} aria-label={`remover ${descricao}`} onClick={onRemover}>
        ✕
      </button>
    </li>
  )
}
