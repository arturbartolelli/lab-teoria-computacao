package com.br.unifor.teoria_computacao.gramatica.dominio;

import static java.util.stream.Collectors.joining;

import java.util.List;

record NoDerivacao(String simbolo, List<NoDerivacao> filhos) {

	static NoDerivacao folha(char simbolo) {
		return new NoDerivacao(String.valueOf(simbolo), List.of());
	}

	static NoDerivacao lambda() {
		return new NoDerivacao(Producao.LAMBDA, List.of());
	}

	static NoDerivacao variavel(char simbolo, List<NoDerivacao> filhos) {
		return new NoDerivacao(String.valueOf(simbolo), List.copyOf(filhos));
	}

	boolean expansivel() {
		return !filhos.isEmpty();
	}

	boolean ehLambda() {
		return !expansivel() && simbolo.equals(Producao.LAMBDA);
	}

	String producaoAplicada() {
		String corpo = filhos.stream().map(NoDerivacao::simbolo).collect(joining());
		return simbolo + " → " + corpo;
	}
}
