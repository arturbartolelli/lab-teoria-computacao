package com.br.unifor.teoria_computacao.automatofinito.dominio;

public record TransicaoAutomato(String origem, String simbolo, String destino) {
	public static final String VAZIO = "";

	public boolean vazia() {
		return simbolo.equals(VAZIO);
	}
}
