package com.br.unifor.teoria_computacao.pilha.api;

import java.util.List;
import java.util.Set;

import com.br.unifor.teoria_computacao.compartilhado.Nomes;
import com.br.unifor.teoria_computacao.compartilhado.Validacoes;
import com.br.unifor.teoria_computacao.pilha.dominio.AutomatoPilha;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AutomatoPilhaRequest(
		@NotNull @Size(max = Validacoes.TAMANHO_MAXIMO_CADEIA) @Pattern(regexp = Validacoes.SEM_ESPACOS, message = Validacoes.MENSAGEM_SEM_ESPACOS) String cadeia,
		@NotBlank String estadoInicial,
		@NotNull Set<@NotBlank String> estadosFinais,
		@NotNull @Size(max = Validacoes.MAXIMO_TRANSICOES) List<@NotNull @Valid TransicaoPilhaRequest> transicoes) {

	AutomatoPilha paraAutomato(int limiteCopias) {
		var transicoesDominio = transicoes.stream().map(TransicaoPilhaRequest::paraDominio).toList();
		return new AutomatoPilha(estadoInicial.strip(), Nomes.limpar(estadosFinais), transicoesDominio,
				limiteCopias);
	}
}
