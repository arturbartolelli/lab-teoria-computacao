package com.br.unifor.teoria_computacao.turing.dominio;

public record Transicao(
		String estadoAtual,
		char simboloLido,
		String novoEstado,
		char simboloEscrito,
		Direcao direcao) {
}
