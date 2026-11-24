package com.br.unifor.teoria_computacao.gramatica.dominio;

import static java.util.stream.Collectors.groupingBy;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.br.unifor.teoria_computacao.compartilhado.ModeloInvalidoException;

public class Gramatica {
	private final Set<Character> variaveis;
	private final Set<Character> terminais;
	private final char simboloInicial;
	private final List<Producao> producoes;
	private final Map<Character, List<Producao>> producoesPorVariavel;

	public Gramatica(Set<Character> variaveis, Set<Character> terminais, char simboloInicial, List<Producao> producoes) {
		this.variaveis = Set.copyOf(variaveis);
		this.terminais = Set.copyOf(terminais);
		this.simboloInicial = simboloInicial;
		this.producoes = List.copyOf(new LinkedHashSet<>(producoes));
		validar();
		this.producoesPorVariavel = this.producoes.stream().collect(groupingBy(Producao::cabeca));
	}

	public char simboloInicial() {
		return simboloInicial;
	}

	public List<Producao> producoes() {
		return producoes;
	}

	public boolean ehVariavel(char simbolo) {
		return variaveis.contains(simbolo);
	}

	public List<Producao> producoesDe(char variavel) {
		return producoesPorVariavel.getOrDefault(variavel, List.of());
	}

	private void validar() {
		variaveis.stream()
				.filter(terminais::contains)
				.findFirst()
				.ifPresent(simbolo -> falhar("'%s' não pode ser variável e terminal ao mesmo tempo".formatted(simbolo)));
		if (!variaveis.contains(simboloInicial)) {
			falhar("O símbolo inicial '%s' precisa estar entre as variáveis".formatted(simboloInicial));
		}
		producoes.forEach(this::validar);
	}

	private void validar(Producao producao) {
		if (!variaveis.contains(producao.cabeca())) {
			falhar("A produção %s tem cabeça que não é variável".formatted(producao));
		}
		producao.corpo().chars()
				.mapToObj(simbolo -> (char) simbolo)
				.filter(simbolo -> !variaveis.contains(simbolo) && !terminais.contains(simbolo))
				.findFirst()
				.ifPresent(simbolo -> falhar(
						"A produção %s usa '%s', que não é variável nem terminal".formatted(producao, simbolo)));
	}

	private static void falhar(String mensagem) {
		throw new ModeloInvalidoException(mensagem);
	}
}
