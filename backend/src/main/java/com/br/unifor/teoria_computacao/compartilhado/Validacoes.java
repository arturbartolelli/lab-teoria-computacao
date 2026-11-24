package com.br.unifor.teoria_computacao.compartilhado;

public final class Validacoes {
	public static final String SIMBOLO = "\\S";
	public static final String SIMBOLO_OU_VAZIO = "\\S?";
	public static final String SEM_ESPACOS = "\\S*";
	public static final String MENSAGEM_SIMBOLO = "deve ser um único caractere que não seja espaço";
	public static final String MENSAGEM_SIMBOLO_OU_VAZIO = "deve ser vazio (ε) ou um único caractere que não seja espaço";
	public static final String MENSAGEM_SEM_ESPACOS = "não pode conter espaços";
	public static final int TAMANHO_MAXIMO_CADEIA = 500;
	public static final int MAXIMO_TRANSICOES = 500;

	private Validacoes() {
	}
}
