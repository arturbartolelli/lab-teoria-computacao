package com.br.unifor.maquina_turing.dominio;

public record Transicao(
		String estadoAtual,
		char simboloLido,
		String novoEstado,
		char simboloEscrito,
		Direcao direcao) {
}
