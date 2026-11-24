package com.br.unifor.teoria_computacao.pilha.dominio;

import java.util.ArrayList;
import java.util.List;

record Copia(String estado, String restante, Pilha pilha, List<PassoPilha> passos) {

	static Copia inicial(String estado, String cadeia) {
		Pilha vazia = new Pilha();
		PassoPilha inicio = new PassoPilha(0, estado, "", cadeia, vazia.conteudo(), null);
		return new Copia(estado, cadeia, vazia, List.of(inicio));
	}

	Copia seguir(TransicaoPilha transicao) {
		String novoRestante = restante.substring(transicao.simbolo().length());
		Pilha novaPilha = pilha.copiar();
		transicao.aplicar(novaPilha);
		List<PassoPilha> novosPassos = new ArrayList<>(passos);
		novosPassos.add(new PassoPilha(passos.size(), transicao.destino(), transicao.simbolo(), novoRestante,
				novaPilha.conteudo(), transicao));
		return new Copia(transicao.destino(), novoRestante, novaPilha, novosPassos);
	}
}
