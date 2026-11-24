import type { ComId, Regra } from '../hooks/useDefinicao'
import { DIGITOS_REGRA, formatarIndice } from '../formatacao'
import styles from './TabelaDeRegras.module.css'

type Largura = 'estado' | 'caractere' | 'palavra'

export type Segmento<R> =
  | string
  | { campo: keyof R & string; rotulo: string; largura: Largura; placeholder?: string; maximo?: number }
  | { campo: keyof R & string; rotulo: string; opcoes: readonly string[] }

interface TabelaDeRegrasProps<R extends Regra<R>> {
  legenda: string
  formato: string
  nomeDaRegra: string
  regras: ComId<R>[]
  segmentos: Segmento<R>[]
  onAlterar: (id: string, campo: keyof R, valor: string) => void
  onRemover: (id: string) => void
}

export function TabelaDeRegras<R extends Regra<R>>({
  legenda,
  formato,
  nomeDaRegra,
  regras,
  segmentos,
  onAlterar,
  onRemover,
}: TabelaDeRegrasProps<R>) {
  return (
    <fieldset className={styles.tabela}>
      <legend className={styles.legenda}>
        {legenda} <span className={styles.formato}>{formato}</span>
      </legend>
      {regras.length === 0 && <p className={styles.vazio}>nenhuma {nomeDaRegra}. use o botão de adicionar.</p>}
      <ol className={styles.lista}>
        {regras.map((regra, posicao) => {
          const descricao = `${nomeDaRegra} ${posicao + 1}`
          return (
            <li key={regra.id} className={styles.linha}>
              <span className={styles.numero}>{formatarIndice(posicao + 1, DIGITOS_REGRA)}</span>
              {segmentos.map((segmento, indice) => (
                <SegmentoDaRegra
                  key={indice}
                  segmento={segmento}
                  regra={regra}
                  descricao={descricao}
                  onAlterar={(campo, valor) => onAlterar(regra.id, campo, valor)}
                />
              ))}
              <button
                type="button"
                className={styles.remover}
                aria-label={`remover ${descricao}`}
                onClick={() => onRemover(regra.id)}
              >
                ✕
              </button>
            </li>
          )
        })}
      </ol>
    </fieldset>
  )
}

interface SegmentoDaRegraProps<R extends Regra<R>> {
  segmento: Segmento<R>
  regra: ComId<R>
  descricao: string
  onAlterar: (campo: keyof R, valor: string) => void
}

function SegmentoDaRegra<R extends Regra<R>>({ segmento, regra, descricao, onAlterar }: SegmentoDaRegraProps<R>) {
  if (typeof segmento === 'string') {
    return <span className={styles.simbolo}>{segmento}</span>
  }
  const rotulo = `${segmento.rotulo} da ${descricao}`
  if ('opcoes' in segmento) {
    return (
      <select
        className={styles.selecao}
        aria-label={rotulo}
        value={regra[segmento.campo]}
        onChange={(evento) => onAlterar(segmento.campo, evento.target.value)}
      >
        {segmento.opcoes.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
    )
  }
  return (
    <input
      className={styles[segmento.largura]}
      aria-label={rotulo}
      value={regra[segmento.campo]}
      placeholder={segmento.placeholder}
      maxLength={segmento.maximo}
      spellCheck={false}
      onChange={(evento) => onAlterar(segmento.campo, evento.target.value)}
    />
  )
}
