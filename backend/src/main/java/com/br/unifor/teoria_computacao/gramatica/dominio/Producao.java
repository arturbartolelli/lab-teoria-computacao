package com.br.unifor.teoria_computacao.gramatica.dominio;

public record Producao(char cabeca, String corpo) {
	public static final String LAMBDA = "λ";

	public int tamanho() {
		return corpo.length();
	}

	public char simbolo(int posicao) {
		return corpo.charAt(posicao);
	}

	@Override
	public String toString() {
		return cabeca + " → " + (corpo.isEmpty() ? LAMBDA : corpo);
	}
}
