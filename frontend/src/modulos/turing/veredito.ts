import type { Tom } from '../../compartilhado/componentes/Veredito'
import type { MotivoParada, Quadro, ResultadoSimulacao } from './tipos'

const BRANCOS_NAS_PONTAS = /^B+|B+$/g

const VEREDITOS: Record<MotivoParada, { titulo: string; tom: Tom }> = {
  ESTADO_FINAL: { titulo: 'ACEITA', tom: 'positivo' },
  SEM_TRANSICAO: { titulo: 'REJEITADA', tom: 'negativo' },
  LIMITE_DE_PASSOS: { titulo: 'INDETERMINADA', tom: 'neutro' },
}

export function classificar(resultado: ResultadoSimulacao) {
  return VEREDITOS[resultado.motivo]
}

export function descreverParada(resultado: ResultadoSimulacao): string {
  const totalPassos = resultado.passos.length
  switch (resultado.motivo) {
    case 'ESTADO_FINAL':
      return `estado final ${resultado.estadoDeParada} alcançado em ${totalPassos} passo(s)`
    case 'SEM_TRANSICAO':
      return `nenhuma transição para δ(${resultado.estadoDeParada}, ${simboloSobCabecote(resultado)}) após ${totalPassos} passo(s)`
    case 'LIMITE_DE_PASSOS':
      return `limite de ${totalPassos} passos atingido sem parar: a máquina pode precisar de mais passos ou estar em laço infinito`
  }
}

export function conteudoDaFita(fita: string): string {
  return fita.replace(BRANCOS_NAS_PONTAS, '')
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
