package com.br.unifor.teoria_computacao.gramatica.api;

import java.util.Arrays;
import java.util.stream.Stream;

import com.br.unifor.teoria_computacao.compartilhado.Validacoes;
import com.br.unifor.teoria_computacao.gramatica.dominio.Producao;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ProducaoRequest(
		@NotNull @Pattern(regexp = Validacoes.SIMBOLO, message = Validacoes.MENSAGEM_SIMBOLO) String cabeca,
		@NotNull @Pattern(regexp = Validacoes.SEM_ESPACOS, message = Validacoes.MENSAGEM_SEM_ESPACOS) String corpo) {

	private static final String SEPARADOR_DE_ALTERNATIVAS = "\\|";

	Stream<Producao> paraDominio() {
		return Arrays.stream(corpo.split(SEPARADOR_DE_ALTERNATIVAS, -1))
				.map(alternativa -> new Producao(cabeca.charAt(0), alternativa));
	}
}
