package com.br.unifor.maquina_turing.dominio;

public enum Direcao {
	L(-1),
	R(1);

	private final int deslocamento;

	Direcao(int deslocamento) {
		this.deslocamento = deslocamento;
	}

	public int deslocamento() {
		return deslocamento;
	}
}
