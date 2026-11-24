package com.br.unifor.teoria_computacao.turing.api;

import com.br.unifor.teoria_computacao.compartilhado.Validacoes;
import com.br.unifor.teoria_computacao.turing.dominio.Direcao;
import com.br.unifor.teoria_computacao.turing.dominio.Transicao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record TransicaoTuringRequest(
		@NotBlank String estadoAtual,
		@NotNull @Pattern(regexp = Validacoes.SIMBOLO, message = Validacoes.MENSAGEM_SIMBOLO) String simboloLido,
		@NotBlank String novoEstado,
		@NotNull @Pattern(regexp = Validacoes.SIMBOLO, message = Validacoes.MENSAGEM_SIMBOLO) String simboloEscrito,
		@NotNull Direcao direcao) {

	Transicao paraDominio() {
		return new Transicao(estadoAtual.strip(), simboloLido.charAt(0), novoEstado.strip(), simboloEscrito.charAt(0),
				direcao);
	}
}
