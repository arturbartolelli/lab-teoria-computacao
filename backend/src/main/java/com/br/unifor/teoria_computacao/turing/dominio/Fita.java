package com.br.unifor.teoria_computacao.turing.dominio;

import java.util.ArrayList;
import java.util.List;

public class Fita {
	public static final char BRANCO = 'B';

	private final List<Character> celulas = new ArrayList<>();
	private int cabecote;

	public Fita(String entrada) {
		celulas.add(BRANCO);
		for (char simbolo : entrada.toCharArray()) {
			celulas.add(simbolo);
		}
		celulas.add(BRANCO);
		cabecote = 1;
	}

	public char ler() {
		return celulas.get(cabecote);
	}

	public void escrever(char simbolo) {
		celulas.set(cabecote, simbolo);
	}

	public void mover(Direcao direcao) {
		cabecote += direcao.deslocamento();
		if (cabecote < 0) {
			celulas.addFirst(BRANCO);
			cabecote = 0;
		} else if (cabecote == celulas.size()) {
			celulas.add(BRANCO);
		}
	}

	public String conteudo() {
		StringBuilder conteudo = new StringBuilder(celulas.size());
		celulas.forEach(conteudo::append);
		return conteudo.toString();
	}

	public int cabecote() {
		return cabecote;
	}
}
