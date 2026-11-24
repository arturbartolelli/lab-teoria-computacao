package com.br.unifor.teoria_computacao.pilha.dominio;

public record TransicaoPilha(String origem, String simbolo, String topo, String destino, String empilhar) {

	boolean aplicavel(Copia copia) {
		boolean mesmoEstado = origem.equals(copia.estado());
		boolean leEntrada = copia.restante().startsWith(simbolo);
		boolean topoConfere = topo.isEmpty() || copia.pilha().topoEh(topo.charAt(0));
		return mesmoEstado && leEntrada && topoConfere;
	}

	void aplicar(Pilha pilha) {
		if (!topo.isEmpty()) {
			pilha.desempilhar();
		}
		if (!empilhar.isEmpty()) {
			pilha.empilhar(empilhar.charAt(0));
		}
	}
}
