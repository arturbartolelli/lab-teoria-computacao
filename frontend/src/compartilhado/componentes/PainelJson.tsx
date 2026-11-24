import { type ChangeEvent, useId, useState } from 'react'
import { BotaoTerminal } from './BotaoTerminal'
import styles from './PainelJson.module.css'

interface PainelJsonProps {
  nomeDoArquivo: string
  atual: unknown
  onCarregar: (dados: unknown) => void
}

export function PainelJson({ nomeDoArquivo, atual, onCarregar }: PainelJsonProps) {
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const idArquivo = useId()
  const idTexto = useId()

  function aplicar(conteudo: string) {
    try {
      onCarregar(JSON.parse(conteudo))
      setErro(null)
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'JSON inválido')
    }
  }

  async function abrirArquivo(evento: ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0]
    evento.target.value = ''
    if (!arquivo) {
      return
    }
    const conteudo = await arquivo.text()
    setTexto(conteudo)
    aplicar(conteudo)
  }

  function baixar() {
    const conteudo = JSON.stringify(atual, null, 2)
    const endereco = URL.createObjectURL(new Blob([conteudo], { type: 'application/json' }))
    const ancora = document.createElement('a')
    ancora.href = endereco
    ancora.download = nomeDoArquivo
    ancora.click()
    URL.revokeObjectURL(endereco)
  }

  return (
    <details className={styles.painel}>
      <summary className={styles.resumo}>json › importar / exportar</summary>
      <label htmlFor={idTexto} className={styles.dica}>
        cole um JSON no formato da API ou abra um arquivo .json
      </label>
      <textarea
        id={idTexto}
        className={styles.texto}
        value={texto}
        spellCheck={false}
        rows={10}
        onChange={(evento) => setTexto(evento.target.value)}
      />
      <div className={styles.acoes}>
        <BotaoTerminal variante="primario" onClick={() => aplicar(texto)}>
          carregar
        </BotaoTerminal>
        <BotaoTerminal onClick={() => setTexto(JSON.stringify(atual, null, 2))}>exportar atual</BotaoTerminal>
        <BotaoTerminal onClick={baixar}>baixar .json</BotaoTerminal>
        <label htmlFor={idArquivo} className={styles.arquivo}>
          abrir arquivo
        </label>
        <input id={idArquivo} type="file" accept=".json,application/json" hidden onChange={abrirArquivo} />
      </div>
      {erro && (
        <p className={styles.erro} role="alert">
          erro: {erro}
        </p>
      )}
    </details>
  )
}
