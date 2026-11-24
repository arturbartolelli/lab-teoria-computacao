package com.br.unifor.teoria_computacao.turing.dominio;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;

class MaquinasDoEnunciadoTest {
	private static final int LIMITE_PASSOS = 5000;

	private static final SimuladorMaquinaTuring W_SUSTENIDO_W = new SimuladorMaquinaTuring("q1", Set.of("qaceita"), List.of(
			new Transicao("q1", '0', "q2", 'x', Direcao.R),
			new Transicao("q1", '1', "q3", 'x', Direcao.R),
			new Transicao("q1", '#', "q8", '#', Direcao.R),
			new Transicao("q2", '0', "q2", '0', Direcao.R),
			new Transicao("q2", '1', "q2", '1', Direcao.R),
			new Transicao("q2", '#', "q4", '#', Direcao.R),
			new Transicao("q3", '0', "q3", '0', Direcao.R),
			new Transicao("q3", '1', "q3", '1', Direcao.R),
			new Transicao("q3", '#', "q5", '#', Direcao.R),
			new Transicao("q4", 'x', "q4", 'x', Direcao.R),
			new Transicao("q4", '0', "q6", 'x', Direcao.L),
			new Transicao("q5", 'x', "q5", 'x', Direcao.R),
			new Transicao("q5", '1', "q6", 'x', Direcao.L),
			new Transicao("q6", '0', "q6", '0', Direcao.L),
			new Transicao("q6", '1', "q6", '1', Direcao.L),
			new Transicao("q6", 'x', "q6", 'x', Direcao.L),
			new Transicao("q6", '#', "q7", '#', Direcao.L),
			new Transicao("q7", '0', "q7", '0', Direcao.L),
			new Transicao("q7", '1', "q7", '1', Direcao.L),
			new Transicao("q7", 'x', "q1", 'x', Direcao.R),
			new Transicao("q8", 'x', "q8", 'x', Direcao.R),
			new Transicao("q8", 'B', "qaceita", 'B', Direcao.R)), LIMITE_PASSOS);

	private static final SimuladorMaquinaTuring SOMA_UNARIA = new SimuladorMaquinaTuring("q0", Set.of("q3"), List.of(
			new Transicao("q0", '0', "q0", '0', Direcao.R),
			new Transicao("q0", '1', "q1", '0', Direcao.R),
			new Transicao("q1", '0', "q1", '0', Direcao.R),
			new Transicao("q1", 'B', "q2", 'B', Direcao.L),
			new Transicao("q2", '0', "q3", 'B', Direcao.R)), LIMITE_PASSOS);

	@ParameterizedTest
	@ValueSource(strings = { "#", "0#0", "1#1", "0110#0110", "101#101" })
	void reconheceWSustenidoW(String cadeia) {
		assertTrue(W_SUSTENIDO_W.executar(cadeia).aceita());
	}

	@Test
	void reconheceWSustenidoWComPalavraLonga() {
		String palavra = "01".repeat(24) + "0";

		ResultadoSimulacao resultado = W_SUSTENIDO_W.executar(palavra + "#" + palavra);

		assertTrue(resultado.aceita());
		assertEquals(LIMITE_PASSOS, resultado.passos().size());
	}

	@ParameterizedTest
	@ValueSource(strings = { "0#1", "01#0", "0#01", "01", "0#0#0", "" })
	void rejeitaCadeiasForaDeWSustenidoW(String cadeia) {
		assertFalse(W_SUSTENIDO_W.executar(cadeia).aceita());
	}

	@ParameterizedTest
	@CsvSource({ "000100,00000", "0001,000", "100,00", "1,''" })
	void somaNumerosUnarios(String cadeia, String soma) {
		ResultadoSimulacao resultado = SOMA_UNARIA.executar(cadeia);

		assertTrue(resultado.aceita());
		assertEquals(soma, resultado.fitaFinal().replace("B", ""));
	}
}
