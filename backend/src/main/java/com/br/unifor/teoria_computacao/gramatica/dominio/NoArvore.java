package com.br.unifor.teoria_computacao.gramatica.dominio;

import java.util.ArrayList;
import java.util.List;

public record NoArvore(int indice, String simbolo, int pai) {
	public static final int SEM_PAI = -1;

	static List<NoArvore> achatar(NoDerivacao raiz) {
		List<NoArvore> nos = new ArrayList<>();
		adicionar(raiz, SEM_PAI, nos);
		return nos;
	}

	private static void adicionar(NoDerivacao no, int pai, List<NoArvore> nos) {
		int indice = nos.size();
		nos.add(new NoArvore(indice, no.simbolo(), pai));
		for (NoDerivacao filho : no.filhos()) {
			adicionar(filho, indice, nos);
		}
	}
}
