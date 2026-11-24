package com.br.unifor.teoria_computacao.turing.dominio;

import java.util.List;

public record ResultadoSimulacao(
		boolean aceita,
		MotivoParada motivo,
		String estadoDeParada,
		String fitaFinal,
		int cabecoteFinal,
		List<Passo> passos) {
}
