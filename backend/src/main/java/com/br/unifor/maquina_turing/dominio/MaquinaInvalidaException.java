package com.br.unifor.maquina_turing.dominio;

public class MaquinaInvalidaException extends RuntimeException {

	public MaquinaInvalidaException(String mensagem) {
		super(mensagem);
	}
}
