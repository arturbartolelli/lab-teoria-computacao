package com.br.unifor.teoria_computacao.pilha.dominio;

import java.util.Stack;

public class Pilha {
	private final Stack<Character> simbolos = new Stack<>();

	public Pilha copiar() {
		Pilha copia = new Pilha();
		copia.simbolos.addAll(simbolos);
		return copia;
	}

	public void empilhar(char simbolo) {
		simbolos.push(simbolo);
	}

	public void desempilhar() {
		simbolos.pop();
	}

	public boolean topoEh(char simbolo) {
		return !simbolos.isEmpty() && simbolos.peek() == simbolo;
	}

	public String conteudo() {
		StringBuilder conteudo = new StringBuilder();
		for (char simbolo : simbolos) {
			conteudo.append(simbolo);
		}
		return conteudo.reverse().toString();
	}
}
