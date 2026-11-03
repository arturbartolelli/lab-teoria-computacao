package com.br.unifor.maquina_turing.api;

import static java.util.stream.Collectors.toUnmodifiableSet;

import java.util.List;
import java.util.Set;

import com.br.unifor.maquina_turing.dominio.SimuladorMaquinaTuring;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SimulacaoRequest(
		@NotNull @Size(max = TAMANHO_MAXIMO_CADEIA) @Pattern(regexp = CADEIA, message = MENSAGEM_CADEIA) String cadeia,
		@NotBlank String estadoInicial,
		@NotEmpty Set<@NotBlank String> estadosFinais,
		@NotNull @Size(max = MAXIMO_TRANSICOES) List<@NotNull @Valid TransicaoRequest> transicoes) {

	static final String SIMBOLO = "\\S";
	static final String MENSAGEM_SIMBOLO = "deve ser um único caractere que não seja espaço";

	private static final int TAMANHO_MAXIMO_CADEIA = 500;
	private static final int MAXIMO_TRANSICOES = 500;
	private static final String CADEIA = "[^B\\s]*";
	private static final String MENSAGEM_CADEIA = "não pode conter espaços nem o símbolo branco B";

	SimuladorMaquinaTuring paraSimulador(int limitePassos) {
		var transicoesDominio = transicoes.stream().map(TransicaoRequest::paraDominio).toList();
		var finais = estadosFinais.stream().map(String::strip).collect(toUnmodifiableSet());
		return new SimuladorMaquinaTuring(estadoInicial.strip(), finais, transicoesDominio, limitePassos);
	}
}
