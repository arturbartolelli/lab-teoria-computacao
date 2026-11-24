package com.br.unifor.teoria_computacao.linguagem.dominio;

import java.util.List;

public record AnaliseLinguagem(
		List<Character> alfabeto,
		List<String> linguagem,
		String cadeia,
		boolean cadeiaValida,
		List<SimboloInvalido> simbolosInvalidos,
		int tamanho,
		boolean pertenceALinguagem,
		String segundaCadeia,
		boolean segundaCadeiaValida,
		String concatenacao,
		int tamanhoConcatenacao,
		int tamanhoMaximoEnumerado,
		List<String> fechoKleene,
		List<String> fechoPositivo) {

	public static AnaliseLinguagem analisar(Linguagem linguagem, String cadeia, String segundaCadeia, int tamanhoMaximo) {
		Alfabeto alfabeto = linguagem.alfabeto();
		String concatenacao = cadeia + segundaCadeia;
		List<String> fechoKleene = alfabeto.cadeiasAte(tamanhoMaximo);
		List<String> fechoPositivo = fechoKleene.stream().filter(palavra -> !palavra.isEmpty()).toList();
		return new AnaliseLinguagem(
				alfabeto.simbolos(),
				linguagem.palavras(),
				cadeia,
				alfabeto.gera(cadeia),
				alfabeto.simbolosInvalidos(cadeia),
				cadeia.length(),
				linguagem.contem(cadeia),
				segundaCadeia,
				alfabeto.gera(segundaCadeia),
				concatenacao,
				concatenacao.length(),
				tamanhoMaximo,
				fechoKleene,
				fechoPositivo);
	}
}
