package com.br.unifor.maquina_turing.api;

import com.br.unifor.maquina_turing.dominio.Direcao;
import com.br.unifor.maquina_turing.dominio.Transicao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record TransicaoRequest(
		@NotBlank String estadoAtual,
		@NotNull @Pattern(regexp = SimulacaoRequest.SIMBOLO, message = SimulacaoRequest.MENSAGEM_SIMBOLO) String simboloLido,
		@NotBlank String novoEstado,
		@NotNull @Pattern(regexp = SimulacaoRequest.SIMBOLO, message = SimulacaoRequest.MENSAGEM_SIMBOLO) String simboloEscrito,
		@NotNull Direcao direcao) {

	Transicao paraDominio() {
		return new Transicao(estadoAtual.strip(), simboloLido.charAt(0), novoEstado.strip(), simboloEscrito.charAt(0),
				direcao);
	}
}
