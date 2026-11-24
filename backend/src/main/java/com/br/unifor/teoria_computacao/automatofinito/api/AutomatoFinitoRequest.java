package com.br.unifor.teoria_computacao.automatofinito.api;

import java.util.List;
import java.util.Set;

import com.br.unifor.teoria_computacao.automatofinito.dominio.AutomatoFinito;
import com.br.unifor.teoria_computacao.compartilhado.Nomes;
import com.br.unifor.teoria_computacao.compartilhado.Validacoes;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AutomatoFinitoRequest(
		@NotNull @Size(max = Validacoes.TAMANHO_MAXIMO_CADEIA) @Pattern(regexp = Validacoes.SEM_ESPACOS, message = Validacoes.MENSAGEM_SEM_ESPACOS) String cadeia,
		@NotEmpty @Size(max = MAXIMO_ESTADOS) Set<@NotBlank String> estados,
		@NotBlank String estadoInicial,
		@NotNull Set<@NotBlank String> estadosFinais,
		@NotNull @Size(max = Validacoes.MAXIMO_TRANSICOES) List<@NotNull @Valid TransicaoAutomatoRequest> transicoes) {

	private static final int MAXIMO_ESTADOS = 200;

	AutomatoFinito paraAutomato() {
		var transicoesDominio = transicoes.stream().map(TransicaoAutomatoRequest::paraDominio).toList();
		return new AutomatoFinito(Nomes.limpar(estados), estadoInicial.strip(), Nomes.limpar(estadosFinais),
				transicoesDominio);
	}
}
