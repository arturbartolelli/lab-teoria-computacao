package com.br.unifor.teoria_computacao.automatofinito.api;

import com.br.unifor.teoria_computacao.automatofinito.dominio.TransicaoAutomato;
import com.br.unifor.teoria_computacao.compartilhado.Validacoes;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record TransicaoAutomatoRequest(
		@NotBlank String origem,
		@NotNull @Pattern(regexp = Validacoes.SIMBOLO_OU_VAZIO, message = Validacoes.MENSAGEM_SIMBOLO_OU_VAZIO) String simbolo,
		@NotBlank String destino) {

	TransicaoAutomato paraDominio() {
		return new TransicaoAutomato(origem.strip(), simbolo, destino.strip());
	}
}
