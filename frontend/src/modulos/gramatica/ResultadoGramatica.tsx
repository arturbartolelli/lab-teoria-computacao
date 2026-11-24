import { useMemo } from 'react'
import { ControlesReproducao } from '../../compartilhado/componentes/ControlesReproducao'
import { LogDePassos } from '../../compartilhado/componentes/LogDePassos'
import { Veredito } from '../../compartilhado/componentes/Veredito'
import { LAMBDA, exibirVazio } from '../../compartilhado/formatacao'
import { useReproducao } from '../../compartilhado/hooks/useReproducao'
import { desenharArvore } from './arvore'
import type { PassoDerivacao, ResultadoDerivacao } from './tipos'
import styles from './ResultadoGramatica.module.css'

const DERIVA = ' ⇒ '

interface ResultadoGramaticaProps {
  resultado: ResultadoDerivacao
}

export function ResultadoGramatica({ resultado }: ResultadoGramaticaProps) {
  const cadeia = exibirVazio(resultado.cadeia, LAMBDA)

  return (
    <div className={styles.resultado}>
      <Veredito
        tom={resultado.aceita ? 'positivo' : 'negativo'}
        titulo={resultado.aceita ? 'ACEITA' : 'REJEITADA'}
        descricao={
          resultado.aceita
            ? `${cadeia} é gerada em ${resultado.derivacao.length - 1} passo(s)`
            : `nenhuma derivação gera ${cadeia}`
        }
      />
      <section aria-label="produções usadas">
        <h3 className={styles.titulo}>produções</h3>
        <p className={styles.producoes}>{resultado.producoes.join('   ')}</p>
      </section>
      {resultado.aceita && (
        <>
          <Derivacao passos={resultado.derivacao} />
          <section aria-label="árvore de derivação">
            <h3 className={styles.titulo}>árvore de derivação</h3>
            <pre className={styles.arvore}>{desenharArvore(resultado.arvore).join('\n')}</pre>
          </section>
        </>
      )}
    </div>
  )
}

function Derivacao({ passos }: { passos: PassoDerivacao[] }) {
  const reproducao = useReproducao(passos.length)
  const linhas = useMemo(
    () =>
      passos.map((passo) =>
        passo.producao ? `⇒ ${passo.formaSentencial}   [${passo.producao}]` : passo.formaSentencial,
      ),
    [passos],
  )
  const formas = passos.slice(0, reproducao.indice + 1).map((passo) => passo.formaSentencial)

  return (
    <section className={styles.derivacao} aria-label="derivação mais à esquerda">
      <h3 className={styles.titulo}>derivação mais à esquerda</h3>
      <p className={styles.formas}>{formas.join(DERIVA)}</p>
      <ControlesReproducao reproducao={reproducao} />
      <LogDePassos linhas={linhas} atual={reproducao.indice} onSelecionar={reproducao.irPara} />
    </section>
  )
}
