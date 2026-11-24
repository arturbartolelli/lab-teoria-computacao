package com.br.unifor.teoria_computacao.pilha.dominio;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class AutomatoPilhaTest {
	private static final int LIMITE_COPIAS = 5000;

	private static final AutomatoPilha ANBN = new AutomatoPilha("q1", Set.of("q4"), List.of(
			new TransicaoPilha("q1", "", "", "q2", "$"),
			new TransicaoPilha("q2", "a", "", "q2", "a"),
			new TransicaoPilha("q2", "b", "a", "q3", ""),
			new TransicaoPilha("q3", "b", "a", "q3", ""),
			new TransicaoPilha("q3", "", "$", "q4", "")), LIMITE_COPIAS);

	private static final AutomatoPilha WWR = new AutomatoPilha("q1", Set.of("q1", "q4"), List.of(
			new TransicaoPilha("q1", "", "", "q2", "$"),
			new TransicaoPilha("q2", "0", "", "q2", "0"),
			new TransicaoPilha("q2", "1", "", "q2", "1"),
			new TransicaoPilha("q2", "", "", "q3", ""),
			new TransicaoPilha("q3", "0", "0", "q3", ""),
			new TransicaoPilha("q3", "1", "1", "q3", ""),
			new TransicaoPilha("q3", "", "$", "q4", "")), LIMITE_COPIAS);

	@Test
	void aceitaAnBnMostrandoPilha() {
		ResultadoPilha resultado = ANBN.executar("aabb");

		assertTrue(resultado.aceita());
		List<String> pilhas = resultado.passos().stream().map(PassoPilha::pilha).toList();
		assertEquals(List.of("", "$", "a$", "aa$", "a$", "$", ""), pilhas);
		assertEquals("q4", resultado.passos().getLast().estado());
	}

	@Test
	void aceitaCadeiaDeTamanhoMaximo() {
		assertTrue(ANBN.executar("a".repeat(250) + "b".repeat(250)).aceita());
	}

	@ParameterizedTest
	@ValueSource(strings = { "", "a", "b", "aab", "abb", "ba", "abab" })
	void rejeitaCadeiasForaDeAnBn(String cadeia) {
		ResultadoPilha resultado = ANBN.executar(cadeia);

		assertFalse(resultado.aceita());
		assertEquals(MotivoParadaPilha.REJEITADA, resultado.motivo());
	}

	@ParameterizedTest
	@ValueSource(strings = { "", "00", "0110", "101101" })
	void aceitaComNaoDeterminismo(String cadeia) {
		assertTrue(WWR.executar(cadeia).aceita());
	}

	@ParameterizedTest
	@ValueSource(strings = { "0", "01", "011", "0111" })
	void rejeitaQuandoNenhumaCopiaAceita(String cadeia) {
		assertFalse(WWR.executar(cadeia).aceita());
	}

	@Test
	void interrompeLacoDeTransicoesVazias() {
		var automato = new AutomatoPilha("q0", Set.of("qf"),
				List.of(new TransicaoPilha("q0", "", "", "q0", "A")), LIMITE_COPIAS);

		ResultadoPilha resultado = automato.executar("");

		assertFalse(resultado.aceita());
		assertEquals(MotivoParadaPilha.LIMITE_DE_COPIAS, resultado.motivo());
	}

	@Test
	void controlaCrescimentoDasCopias() {
		var automato = new AutomatoPilha("q0", Set.of("qf"), List.of(
				new TransicaoPilha("q0", "a", "", "q0", "X"),
				new TransicaoPilha("q0", "a", "", "q0", "Y")), LIMITE_COPIAS);

		assertEquals(MotivoParadaPilha.LIMITE_DE_COPIAS, automato.executar("a".repeat(500)).motivo());
	}
}
