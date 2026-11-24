import { JanelaTerminal } from '../../compartilhado/componentes/JanelaTerminal'
import { ANALISES, NOTACOES, VARIAVEIS } from './analises'
import styles from './ModuloComplexidade.module.css'

export function ModuloComplexidade() {
  return (
    <JanelaTerminal titulo="~/complexidade/analise.md" rotulo="Análise de complexidade">
      <div className={styles.conteudo}>
        <section className={styles.legendas} aria-label="notação">
          <dl className={styles.notacoes}>
            {NOTACOES.map(({ simbolo, significado }) => (
              <div key={simbolo}>
                <dt>{simbolo}</dt>
                <dd>{significado}</dd>
              </div>
            ))}
          </dl>
          <ul className={styles.variaveis}>
            {VARIAVEIS.map((variavel) => (
              <li key={variavel}>{variavel}</li>
            ))}
          </ul>
        </section>
        <div className={styles.rolagem}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>módulo</th>
                <th>algoritmo</th>
                <th>melhor caso</th>
                <th>caso médio</th>
                <th>pior caso</th>
                <th>justificativa</th>
              </tr>
            </thead>
            <tbody>
              {ANALISES.map((analise) => (
                <tr key={`${analise.modulo}-${analise.algoritmo}`}>
                  <td className={styles.modulo}>{analise.modulo}</td>
                  <td>
                    {analise.algoritmo}
                    <code className={styles.implementacao}>{analise.implementacao}</code>
                  </td>
                  <td className={styles.ordem}>{analise.melhor}</td>
                  <td className={styles.ordem}>{analise.medio}</td>
                  <td className={styles.ordem}>{analise.pior}</td>
                  <td className={styles.justificativa}>{analise.justificativa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </JanelaTerminal>
  )
}
