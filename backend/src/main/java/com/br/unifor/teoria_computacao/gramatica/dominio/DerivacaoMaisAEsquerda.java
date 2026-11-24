package com.br.unifor.teoria_computacao.gramatica.dominio;

import static java.util.stream.Collectors.joining;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

final class DerivacaoMaisAEsquerda {

	private DerivacaoMaisAEsquerda() {
	}

	static List<PassoDerivacao> de(NoDerivacao raiz) {
		List<PassoDerivacao> passos = new ArrayList<>();
		List<NoDerivacao> forma = new ArrayList<>(List.of(raiz));
		passos.add(new PassoDerivacao(0, texto(forma), null));

		int indice = primeiraVariavel(forma);
		while (indice >= 0) {
			NoDerivacao expandido = forma.remove(indice);
			forma.addAll(indice, expandido.filhos().stream().filter(filho -> !filho.ehLambda()).toList());
			passos.add(new PassoDerivacao(passos.size(), texto(forma), expandido.producaoAplicada()));
			indice = primeiraVariavel(forma);
		}
		return passos;
	}

	private static int primeiraVariavel(List<NoDerivacao> forma) {
		return IntStream.range(0, forma.size())
				.filter(posicao -> forma.get(posicao).expansivel())
				.findFirst()
				.orElse(-1);
	}

	private static String texto(List<NoDerivacao> forma) {
		String texto = forma.stream().map(NoDerivacao::simbolo).collect(joining());
		return texto.isEmpty() ? Producao.LAMBDA : texto;
	}
}
