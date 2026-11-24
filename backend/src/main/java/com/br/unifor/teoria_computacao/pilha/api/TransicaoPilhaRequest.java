package com.br.unifor.teoria_computacao.pilha.api;

import com.br.unifor.teoria_computacao.compartilhado.Validacoes;
import com.br.unifor.teoria_computacao.pilha.dominio.TransicaoPilha;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record TransicaoPilhaRequest(
		@NotBlank String origem,
		@NotNull @Pattern(regexp = Validacoes.SIMBOLO_OU_VAZIO, message = Validacoes.MENSAGEM_SIMBOLO_OU_VAZIO) String simbolo,
		@NotNull @Pattern(regexp = Validacoes.SIMBOLO_OU_VAZIO, message = Validacoes.MENSAGEM_SIMBOLO_OU_VAZIO) String topo,
		@NotBlank String destino,
		@NotNull @Pattern(regexp = Validacoes.SIMBOLO_OU_VAZIO, message = Validacoes.MENSAGEM_SIMBOLO_OU_VAZIO) String empilhar) {

	TransicaoPilha paraDominio() {
		return new TransicaoPilha(origem.strip(), simbolo, topo, destino.strip(), empilhar);
	}
}
