package com.br.unifor.teoria_computacao.linguagem.dominio;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.br.unifor.teoria_computacao.compartilhado.ModeloInvalidoException;

public class Alfabeto {
	private static final int LIMITE_DE_CADEIAS = 2000;

	private final Set<Character> simbolos;

	public Alfabeto(List<Character> simbolos) {
		if (simbolos.isEmpty()) {
			throw new ModeloInvalidoException("O alfabeto Σ deve ter ao menos um símbolo");
		}
		this.simbolos = new LinkedHashSet<>(simbolos);
	}

	public List<Character> simbolos() {
		return List.copyOf(simbolos);
	}

	public boolean gera(String cadeia) {
		return simbolosInvalidos(cadeia).isEmpty();
	}

	public List<SimboloInvalido> simbolosInvalidos(String cadeia) {
		List<SimboloInvalido> invalidos = new ArrayList<>();
		for (int posicao = 0; posicao < cadeia.length(); posicao++) {
			if (!simbolos.contains(cadeia.charAt(posicao))) {
				invalidos.add(new SimboloInvalido(posicao, cadeia.charAt(posicao)));
			}
		}
		return invalidos;
	}

	public List<String> cadeiasAte(int tamanhoMaximo) {
		List<String> camada = List.of("");
		List<String> cadeias = new ArrayList<>(camada);
		for (int tamanho = 1; tamanho <= tamanhoMaximo; tamanho++) {
			camada = estender(camada);
			cadeias.addAll(camada);
			if (cadeias.size() > LIMITE_DE_CADEIAS) {
				throw new ModeloInvalidoException("Σ* até tamanho %d passa de %d cadeias; reduza o tamanho máximo"
						.formatted(tamanhoMaximo, LIMITE_DE_CADEIAS));
			}
		}
		return cadeias;
	}

	private List<String> estender(List<String> cadeias) {
		List<String> maiores = new ArrayList<>();
		for (String cadeia : cadeias) {
			for (char simbolo : simbolos) {
				maiores.add(cadeia + simbolo);
			}
		}
		return maiores;
	}
}
