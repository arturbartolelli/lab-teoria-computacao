package com.br.unifor.teoria_computacao.pilha.dominio;

import java.util.List;

public record ResultadoPilha(
		boolean aceita,
		MotivoParadaPilha motivo,
		List<PassoPilha> passos,
		int copias) {
}
