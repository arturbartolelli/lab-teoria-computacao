package com.br.unifor.teoria_computacao.pilha.dominio;

public record PassoPilha(
		int numero,
		String estado,
		String lido,
		String entradaRestante,
		String pilha,
		TransicaoPilha transicao) {
}
