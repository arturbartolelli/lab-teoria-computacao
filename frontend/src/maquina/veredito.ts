import type { Quadro, ResultadoSimulacao } from '../api/tipos'

export type Veredito = 'ACEITA' | 'REJEITADA' | 'INDETERMINADA'

export function classificar(resultado: ResultadoSimulacao): Veredito {
  switch (resultado.motivo) {
    case 'ESTADO_FINAL':
      return 'ACEITA'
    case 'SEM_TRANSICAO':
      return 'REJEITADA'
    case 'LIMITE_DE_PASSOS':
      return 'INDETERMINADA'
  }
}

export function descreverParada(resultado: ResultadoSimulacao): string {
  const totalPassos = resultado.passos.length
  switch (resultado.motivo) {
    case 'ESTADO_FINAL':
      return `estado final ${resultado.estadoDeParada} alcançado em ${totalPassos} passo(s)`
    case 'SEM_TRANSICAO':
      return `nenhuma transição para δ(${resultado.estadoDeParada}, ${simboloSobCabecote(resultado)}) após ${totalPassos} passo(s)`
    case 'LIMITE_DE_PASSOS':
      return `limite de ${totalPassos} passos atingido sem parar: a máquina pode estar em laço infinito`
  }
}

export function montarQuadros(resultado: ResultadoSimulacao): Quadro[] {
  const quadroFinal: Quadro = {
    estado: resultado.estadoDeParada,
    fita: resultado.fitaFinal,
    cabecote: resultado.cabecoteFinal,
  }
  return [...resultado.passos, quadroFinal]
}

function simboloSobCabecote(resultado: ResultadoSimulacao): string {
  return resultado.fitaFinal.charAt(resultado.cabecoteFinal)
}
