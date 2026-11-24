package com.br.unifor.teoria_computacao.linguagem.dominio;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.br.unifor.teoria_computacao.compartilhado.ModeloInvalidoException;

public class Linguagem {
	private final Alfabeto alfabeto;
	private final Set<String> palavras;

	public Linguagem(Alfabeto alfabeto, List<String> palavras) {
		for (String palavra : palavras) {
			if (!alfabeto.gera(palavra)) {
				throw new ModeloInvalidoException(
						"A palavra \"%s\" da linguagem L usa símbolos fora de Σ".formatted(palavra));
			}
		}
		this.alfabeto = alfabeto;
		this.palavras = new LinkedHashSet<>(palavras);
	}

	public Alfabeto alfabeto() {
		return alfabeto;
	}

	public List<String> palavras() {
		return List.copyOf(palavras);
	}

	public boolean contem(String cadeia) {
		return palavras.contains(cadeia);
	}
}
