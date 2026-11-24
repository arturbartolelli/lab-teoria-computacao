package com.br.unifor.teoria_computacao.linguagem.api;

import java.util.List;

import com.br.unifor.teoria_computacao.compartilhado.Validacoes;
import com.br.unifor.teoria_computacao.linguagem.dominio.Alfabeto;
import com.br.unifor.teoria_computacao.linguagem.dominio.Linguagem;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AnaliseLinguagemRequest(
		@NotEmpty @Size(max = MAXIMO_SIMBOLOS) List<@NotNull @Pattern(regexp = Validacoes.SIMBOLO, message = Validacoes.MENSAGEM_SIMBOLO) String> alfabeto,
		@NotNull @Size(max = MAXIMO_PALAVRAS) List<@NotNull @Pattern(regexp = Validacoes.SEM_ESPACOS, message = Validacoes.MENSAGEM_SEM_ESPACOS) String> linguagem,
		@NotNull @Size(max = Validacoes.TAMANHO_MAXIMO_CADEIA) String cadeia,
		@NotNull @Size(max = Validacoes.TAMANHO_MAXIMO_CADEIA) String segundaCadeia,
		@Min(0) @Max(TAMANHO_MAXIMO_ENUMERADO) int tamanhoMaximo) {

	private static final int MAXIMO_SIMBOLOS = 100;
	private static final int MAXIMO_PALAVRAS = 200;
	private static final int TAMANHO_MAXIMO_ENUMERADO = 10;

	Linguagem paraLinguagem() {
		var simbolos = alfabeto.stream().map(simbolo -> simbolo.charAt(0)).toList();
		return new Linguagem(new Alfabeto(simbolos), linguagem);
	}
}
