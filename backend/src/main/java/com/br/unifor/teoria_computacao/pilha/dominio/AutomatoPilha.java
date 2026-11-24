package com.br.unifor.teoria_computacao.pilha.dominio;

import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;
import java.util.Set;

public class AutomatoPilha {
	private final String estadoInicial;
	private final Set<String> estadosFinais;
	private final List<TransicaoPilha> transicoes;
	private final int limiteCopias;

	public AutomatoPilha(String estadoInicial, Set<String> estadosFinais, List<TransicaoPilha> transicoes,
			int limiteCopias) {
		this.estadoInicial = estadoInicial;
		this.estadosFinais = estadosFinais;
		this.transicoes = List.copyOf(new LinkedHashSet<>(transicoes));
		this.limiteCopias = limiteCopias;
	}

	public ResultadoPilha executar(String cadeia) {
		Copia maisAvancada = Copia.inicial(estadoInicial, cadeia);
		Queue<Copia> copias = new LinkedList<>();
		copias.add(maisAvancada);
		int criadas = 1;

		while (!copias.isEmpty()) {
			Copia copia = copias.remove();
			if (aceita(copia)) {
				return new ResultadoPilha(true, MotivoParadaPilha.ACEITA, copia.passos(), criadas);
			}
			if (copia.restante().length() < maisAvancada.restante().length()) {
				maisAvancada = copia;
			}
			for (TransicaoPilha transicao : transicoes) {
				if (transicao.aplicavel(copia)) {
					if (criadas == limiteCopias) {
						return new ResultadoPilha(false, MotivoParadaPilha.LIMITE_DE_COPIAS, maisAvancada.passos(), criadas);
					}
					copias.add(copia.seguir(transicao));
					criadas++;
				}
			}
		}
		return new ResultadoPilha(false, MotivoParadaPilha.REJEITADA, maisAvancada.passos(), criadas);
	}

	private boolean aceita(Copia copia) {
		return copia.restante().isEmpty() && estadosFinais.contains(copia.estado());
	}
}
