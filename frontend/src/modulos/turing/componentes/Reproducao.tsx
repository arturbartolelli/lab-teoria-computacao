import { useMemo } from 'react'
import { ControlesReproducao } from '../../../compartilhado/componentes/ControlesReproducao'
import { LogDePassos } from '../../../compartilhado/componentes/LogDePassos'
import { Veredito } from '../../../compartilhado/componentes/Veredito'
import { useReproducao } from '../../../compartilhado/hooks/useReproducao'
import { formatarTransicao } from '../formatacao'
import type { ResultadoSimulacao } from '../tipos'
import { classificar, conteudoDaFita, descreverParada, montarQuadros } from '../veredito'
import { FitaVisual } from './FitaVisual'
import styles from './Reproducao.module.css'

interface ReproducaoProps {
  resultado: ResultadoSimulacao
}

export function Reproducao({ resultado }: ReproducaoProps) {
  const quadros = useMemo(() => montarQuadros(resultado), [resultado])
  const linhas = useMemo(
    () => [...resultado.passos.map((passo) => formatarTransicao(passo.transicao)), 'halt'],
    [resultado],
  )
  const reproducao = useReproducao(quadros.length)
  const quadro = quadros[reproducao.indice]
  const proximaTransicao = resultado.passos[reproducao.indice]?.transicao
  const { titulo, tom } = classificar(resultado)

  return (
    <div className={styles.reproducao}>
      <Veredito tom={tom} titulo={titulo} descricao={descreverParada(resultado)} />
      <p className={styles.fitaFinal}>
        fita final ❯ <strong>{conteudoDaFita(resultado.fitaFinal) || 'ε'}</strong>
      </p>
      {quadro && <FitaVisual quadro={quadro} />}
      <p className={styles.proxima}>
        {proximaTransicao ? `próxima: ${formatarTransicao(proximaTransicao)}` : 'máquina parada'}
      </p>
      <ControlesReproducao reproducao={reproducao} />
      <LogDePassos linhas={linhas} atual={reproducao.indice} onSelecionar={reproducao.irPara} />
    </div>
  )
}
