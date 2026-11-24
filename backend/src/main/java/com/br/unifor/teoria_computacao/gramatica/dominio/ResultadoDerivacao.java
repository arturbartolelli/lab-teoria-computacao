package com.br.unifor.teoria_computacao.gramatica.dominio;

import java.util.List;

public record ResultadoDerivacao(
		boolean aceita,
		String cadeia,
		List<String> producoes,
		List<PassoDerivacao> derivacao,
		List<NoArvore> arvore) {
}
