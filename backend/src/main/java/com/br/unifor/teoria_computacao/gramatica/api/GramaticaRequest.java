package com.br.unifor.teoria_computacao.gramatica.api;

import static java.util.stream.Collectors.toUnmodifiableSet;

import java.util.List;
import java.util.Set;

import com.br.unifor.teoria_computacao.compartilhado.Validacoes;
import com.br.unifor.teoria_computacao.gramatica.dominio.Gramatica;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record GramaticaRequest(
		@NotEmpty Set<@NotNull @Pattern(regexp = Validacoes.SIMBOLO, message = Validacoes.MENSAGEM_SIMBOLO) String> variaveis,
		@NotNull Set<@NotNull @Pattern(regexp = Validacoes.SIMBOLO, message = Validacoes.MENSAGEM_SIMBOLO) String> terminais,
		@NotNull @Pattern(regexp = Validacoes.SIMBOLO, message = Validacoes.MENSAGEM_SIMBOLO) String simboloInicial,
		@NotEmpty @Size(max = MAXIMO_PRODUCOES) List<@NotNull @Valid ProducaoRequest> producoes,
		@NotNull @Size(max = TAMANHO_MAXIMO_CADEIA) @Pattern(regexp = Validacoes.SEM_ESPACOS, message = Validacoes.MENSAGEM_SEM_ESPACOS) String cadeia) {

	private static final int MAXIMO_PRODUCOES = 200;
	private static final int TAMANHO_MAXIMO_CADEIA = 100;

	Gramatica paraGramatica() {
		var producoesDominio = producoes.stream().flatMap(ProducaoRequest::paraDominio).toList();
		return new Gramatica(simbolos(variaveis), simbolos(terminais), simboloInicial.charAt(0), producoesDominio);
	}

	private static Set<Character> simbolos(Set<String> textos) {
		return textos.stream().map(texto -> texto.charAt(0)).collect(toUnmodifiableSet());
	}
}
