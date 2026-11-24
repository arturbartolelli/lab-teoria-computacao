package com.br.unifor.teoria_computacao.turing.api;

import java.util.List;
import java.util.Set;

import com.br.unifor.teoria_computacao.compartilhado.Nomes;
import com.br.unifor.teoria_computacao.compartilhado.Validacoes;
import com.br.unifor.teoria_computacao.turing.dominio.SimuladorMaquinaTuring;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record MaquinaTuringRequest(
		@NotNull @Size(max = Validacoes.TAMANHO_MAXIMO_CADEIA) @Pattern(regexp = CADEIA, message = MENSAGEM_CADEIA) String cadeia,
		@NotBlank String estadoInicial,
		@NotEmpty Set<@NotBlank String> estadosFinais,
		@NotNull @Size(max = Validacoes.MAXIMO_TRANSICOES) List<@NotNull @Valid TransicaoTuringRequest> transicoes) {

	private static final String CADEIA = "[^B\\s]*";
	private static final String MENSAGEM_CADEIA = "não pode conter espaços nem o símbolo branco B";

	SimuladorMaquinaTuring paraSimulador(int limitePassos) {
		var transicoesDominio = transicoes.stream().map(TransicaoTuringRequest::paraDominio).toList();
		return new SimuladorMaquinaTuring(estadoInicial.strip(), Nomes.limpar(estadosFinais), transicoesDominio,
				limitePassos);
	}
}
