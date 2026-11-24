import type { ComponentType } from 'react'
import { Abas } from './compartilhado/componentes/Abas'
import { Cabecalho } from './compartilhado/componentes/Cabecalho'
import { useAbaAtiva } from './compartilhado/hooks/useAbaAtiva'
import { ModuloAutomatoFinito } from './modulos/automatofinito/ModuloAutomatoFinito'
import { ModuloComplexidade } from './modulos/complexidade/ModuloComplexidade'
import { ModuloGramatica } from './modulos/gramatica/ModuloGramatica'
import { ModuloLinguagem } from './modulos/linguagem/ModuloLinguagem'
import { ModuloPilha } from './modulos/pilha/ModuloPilha'
import { ModuloTuring } from './modulos/turing/ModuloTuring'
import styles from './App.module.css'

interface Modulo {
  id: string
  rotulo: string
  descricao: string
  Componente: ComponentType
  largo?: boolean
}

const MODULOS: readonly Modulo[] = [
  {
    id: 'linguagens',
    rotulo: 'linguagens formais',
    descricao: 'alfabeto Σ, linguagem L, validação de cadeias, Σ*, Σ⁺, tamanho e concatenação',
    Componente: ModuloLinguagem,
  },
  {
    id: 'automatos',
    rotulo: 'afd / afn',
    descricao: 'autômatos finitos determinísticos e não determinísticos com transições ε',
    Componente: ModuloAutomatoFinito,
  },
  {
    id: 'gramaticas',
    rotulo: 'glc',
    descricao: 'gramáticas livres de contexto: derivação mais à esquerda e árvore de derivação',
    Componente: ModuloGramatica,
  },
  {
    id: 'pilha',
    rotulo: 'autômato com pilha',
    descricao: 'autômatos com pilha: leitura, estado e conteúdo da pilha',
    Componente: ModuloPilha,
  },
  {
    id: 'turing',
    rotulo: 'máquina de turing',
    descricao: 'máquina de turing determinística · fita infinita · branco = B · direções L e R',
    Componente: ModuloTuring,
  },
  {
    id: 'complexidade',
    rotulo: 'complexidade',
    descricao: 'análise assintótica dos algoritmos implementados: melhor, médio e pior caso',
    Componente: ModuloComplexidade,
    largo: true,
  },
]

const IDS = MODULOS.map((modulo) => modulo.id)

export function App() {
  const ativa = useAbaAtiva(IDS, 'linguagens')
  const moduloAtivo = MODULOS.find((modulo) => modulo.id === ativa) ?? MODULOS[0]

  return (
    <main className={styles.layout}>
      <Cabecalho comando={`./simulador --modulo ${ativa}`} descricao={moduloAtivo?.descricao ?? ''} />
      <Abas abas={MODULOS} ativa={ativa} />
      {MODULOS.map(({ id, Componente, largo }) => (
        <section key={id} className={largo ? styles.moduloLargo : styles.modulo} hidden={id !== ativa}>
          <Componente />
        </section>
      ))}
    </main>
  )
}
