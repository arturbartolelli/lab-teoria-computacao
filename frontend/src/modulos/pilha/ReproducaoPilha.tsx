import { memo } from 'react'
import type { Tom } from '../../compartilhado/componentes/Veredito'
import { ControlesReproducao } from '../../compartilhado/componentes/ControlesReproducao'
import { EntradaConsumida } from '../../compartilhado/componentes/EntradaConsumida'
import { Veredito } from '../../compartilhado/componentes/Veredito'
import { exibirVazio } from '../../compartilhado/formatacao'
import { useCentralizarAtivo } from '../../compartilhado/hooks/useCentralizarAtivo'
import { useReproducao } from '../../compartilhado/hooks/useReproducao'
import type { MotivoParadaPilha, PassoPilha, ResultadoPilha, TransicaoPilha } from './tipos'
import styles from './ReproducaoPilha.module.css'

const VEREDITOS: Record<MotivoParadaPilha, { titulo: string; tom: Tom; descricao: string }> = {
  ACEITA: { titulo: 'ACEITA', tom: 'positivo', descricao: 'uma cópia leu toda a entrada e está em estado final' },
  REJEITADA: { titulo: 'REJEITADA', tom: 'negativo', descricao: 'nenhuma cópia aceita; exibindo a que mais avançou' },
  LIMITE_DE_COPIAS: { titulo: 'INDETERMINADA', tom: 'neutro', descricao: 'limite de cópias atingido' },
}

interface ReproducaoPilhaProps {
  resultado: ResultadoPilha
}

export function ReproducaoPilha({ resultado }: ReproducaoPilhaProps) {
  const reproducao = useReproducao(resultado.passos.length)
  const passo = resultado.passos[reproducao.indice]
  const cadeia = resultado.passos[0]?.entradaRestante ?? ''
  const { titulo, tom, descricao } = VEREDITOS[resultado.motivo]

  return (
    <div className={styles.reproducao}>
      <Veredito tom={tom} titulo={titulo} descricao={`${descricao} · ${resultado.passos.length - 1} passo(s) · ${resultado.copias} cópia(s)`} />
      {passo && (
        <div className={styles.painel}>
          <div className={styles.leitura}>
            <EntradaConsumida cadeia={cadeia} consumidos={cadeia.length - passo.entradaRestante.length} />
            <p className={styles.estado}>
              estado ❯ <strong>{passo.estado}</strong>
            </p>
            <p className={styles.transicao}>
              {passo.transicao ? `aplicou ${formatarTransicao(passo.transicao)}` : 'configuração inicial'}
            </p>
          </div>
          <Pilha conteudo={passo.pilha} />
        </div>
      )}
      <ControlesReproducao reproducao={reproducao} />
      <TabelaDePassos passos={resultado.passos} atual={reproducao.indice} onSelecionar={reproducao.irPara} />
    </div>
  )
}

function Pilha({ conteudo }: { conteudo: string }) {
  return (
    <figure className={styles.pilha} aria-label={`pilha: ${exibirVazio(conteudo)}`}>
      <figcaption className={styles.rotuloPilha}>pilha · topo ↑</figcaption>
      <ol className={styles.celulas}>
        {conteudo === '' ? (
          <li className={styles.vazia}>vazia</li>
        ) : (
          conteudo.split('').map((simbolo, posicao) => (
            <li key={posicao} className={posicao === 0 ? styles.topo : styles.celula}>
              {simbolo}
            </li>
          ))
        )}
      </ol>
    </figure>
  )
}

interface TabelaDePassosProps {
  passos: PassoPilha[]
  atual: number
  onSelecionar: (indice: number) => void
}

const TabelaDePassos = memo(function TabelaDePassos({ passos, atual, onSelecionar }: TabelaDePassosProps) {
  const rolagem = useCentralizarAtivo<HTMLDivElement>('vertical', atual, 'tbody > tr')

  return (
    <div ref={rolagem} className={styles.rolagem}>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>#</th>
            <th>leitura</th>
            <th>estado</th>
            <th>restante</th>
            <th>pilha (topo à esquerda)</th>
          </tr>
        </thead>
        <tbody>
          {passos.map((passo) => (
            <tr
              key={passo.numero}
              className={passo.numero === atual ? styles.linhaAtiva : undefined}
              onClick={() => onSelecionar(passo.numero)}
            >
              <td>{passo.numero}</td>
              <td>{passo.transicao ? exibirVazio(passo.lido) : '—'}</td>
              <td>{passo.estado}</td>
              <td>{exibirVazio(passo.entradaRestante)}</td>
              <td>{exibirVazio(passo.pilha)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

function formatarTransicao({ origem, simbolo, topo, destino, empilhar }: TransicaoPilha): string {
  return `δ(${origem}, ${exibirVazio(simbolo)}, ${exibirVazio(topo)}) = (${destino}, ${exibirVazio(empilhar)})`
}
