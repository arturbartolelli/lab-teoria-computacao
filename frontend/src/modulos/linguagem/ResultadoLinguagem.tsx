import { Veredito } from '../../compartilhado/componentes/Veredito'
import { LAMBDA, exibirVazio, formatarConjunto } from '../../compartilhado/formatacao'
import type { AnaliseLinguagem } from './tipos'
import styles from './ResultadoLinguagem.module.css'

interface ResultadoLinguagemProps {
  resultado: AnaliseLinguagem
}

export function ResultadoLinguagem({ resultado: analise }: ResultadoLinguagemProps) {
  const sigma = formatarConjunto(analise.alfabeto)
  const posicoesInvalidas = new Set(analise.simbolosInvalidos.map(({ posicao }) => posicao))

  return (
    <div className={styles.resultado}>
      <Veredito
        tom={analise.cadeiaValida ? 'positivo' : 'negativo'}
        titulo={analise.cadeiaValida ? 'CADEIA VÁLIDA PARA Σ' : 'CADEIA INVÁLIDA PARA Σ'}
        descricao={`Σ = ${sigma} · tamanho = ${analise.tamanho}`}
      />

      <p className={styles.cadeia} aria-label="cadeia analisada">
        w ❯{' '}
        {analise.cadeia === ''
          ? LAMBDA
          : analise.cadeia.split('').map((simbolo, posicao) => (
              <span key={posicao} className={posicoesInvalidas.has(posicao) ? styles.invalido : styles.valido}>
                {simbolo}
              </span>
            ))}
      </p>
      {analise.simbolosInvalidos.length > 0 && (
        <p className={styles.alerta}>
          símbolos fora de Σ:{' '}
          {analise.simbolosInvalidos.map(({ simbolo, posicao }) => `'${simbolo}' na posição ${posicao}`).join(', ')}
        </p>
      )}

      <dl className={styles.tabela}>
        <dt>|w|</dt>
        <dd>{analise.tamanho}</dd>
        <dt>L</dt>
        <dd>{formatarConjunto(analise.linguagem.map((palavra) => exibirVazio(palavra, LAMBDA)))}</dd>
        <dt>w ∈ L</dt>
        <dd className={analise.pertenceALinguagem ? styles.sim : styles.nao}>{analise.pertenceALinguagem ? 'sim' : 'não'}</dd>
        <dt>v</dt>
        <dd>
          {exibirVazio(analise.segundaCadeia, LAMBDA)}{' '}
          <span className={analise.segundaCadeiaValida ? styles.sim : styles.nao}>
            ({analise.segundaCadeiaValida ? 'válida' : 'inválida'} para Σ)
          </span>
        </dd>
        <dt>w·v</dt>
        <dd>{exibirVazio(analise.concatenacao, LAMBDA)}</dd>
        <dt>|w·v|</dt>
        <dd>{analise.tamanhoConcatenacao}</dd>
      </dl>

      <Fecho
        titulo={`Σ* (cadeias com até ${analise.tamanhoMaximoEnumerado} símbolos)`}
        cadeias={analise.fechoKleene}
      />
      <Fecho titulo={`Σ⁺ = Σ* − {λ} (até ${analise.tamanhoMaximoEnumerado} símbolos)`} cadeias={analise.fechoPositivo} />
    </div>
  )
}

function Fecho({ titulo, cadeias }: { titulo: string; cadeias: string[] }) {
  return (
    <section className={styles.fecho} aria-label={titulo}>
      <h3 className={styles.tituloFecho}>
        {titulo} <span className={styles.contagem}>· {cadeias.length} cadeias</span>
      </h3>
      <ul className={styles.cadeias}>
        {cadeias.map((cadeia) => (
          <li key={cadeia}>{exibirVazio(cadeia, LAMBDA)}</li>
        ))}
      </ul>
    </section>
  )
}
