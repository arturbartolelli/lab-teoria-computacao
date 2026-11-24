package com.br.unifor.teoria_computacao.automatofinito.dominio;

import java.util.List;

public record PassoAutomato(
		int numero,
		String simbolo,
		List<String> estadosAnteriores,
		List<String> estadosAtuais,
		List<TransicaoAutomato> transicoes,
		List<TransicaoAutomato> transicoesVazias) {
}
