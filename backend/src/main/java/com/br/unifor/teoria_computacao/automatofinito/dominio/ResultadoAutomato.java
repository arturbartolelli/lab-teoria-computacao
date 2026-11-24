package com.br.unifor.teoria_computacao.automatofinito.dominio;

import java.util.List;

public record ResultadoAutomato(
		String cadeia,
		TipoAutomato tipo,
		boolean aceita,
		List<String> estados,
		String estadoInicial,
		List<String> estadosFinais,
		List<TransicaoAutomato> transicoes,
		List<String> estadosIniciaisAtivos,
		List<TransicaoAutomato> transicoesVaziasIniciais,
		List<PassoAutomato> passos,
		int simbolosConsumidos) {
}
