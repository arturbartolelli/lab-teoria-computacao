package com.br.unifor.teoria_computacao.turing.dominio;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.br.unifor.teoria_computacao.compartilhado.ModeloInvalidoException;

class SimuladorMaquinaTuringTest {
	private static final int LIMITE_PASSOS = 50;

	private static final List<Transicao> MAQUINA_DA_AULA = List.of(
			new Transicao("q0", '0', "q0", '0', Direcao.R),
			new Transicao("q0", '1', "q1", '0', Direcao.R),
			new Transicao("q1", '0', "q1", '0', Direcao.R),
			new Transicao("q1", '1', "q2", 'B', Direcao.L),
			new Transicao("q2", '0', "q3", 'B', Direcao.R));

	private static SimuladorMaquinaTuring simuladorDaAula() {
		return new SimuladorMaquinaTuring("q0", Set.of("q3"), MAQUINA_DA_AULA, LIMITE_PASSOS);
	}

	@Test
	void aceitaCadeiaQueAlcancaEstadoFinal() {
		ResultadoSimulacao resultado = simuladorDaAula().executar("0001001");

		assertTrue(resultado.aceita());
		assertEquals(MotivoParada.ESTADO_FINAL, resultado.motivo());
		assertEquals("q3", resultado.estadoDeParada());
		assertEquals("B00000BBB", resultado.fitaFinal());
		assertEquals(7, resultado.cabecoteFinal());
		assertEquals(8, resultado.passos().size());
	}

	@Test
	void rejeitaCadeiaQueParaSemTransicao() {
		ResultadoSimulacao resultado = simuladorDaAula().executar("000100");

		assertFalse(resultado.aceita());
		assertEquals(MotivoParada.SEM_TRANSICAO, resultado.motivo());
		assertEquals("q1", resultado.estadoDeParada());
	}

	@Test
	void registraConfiguracaoAntesDeCadaTransicao() {
		Passo primeiro = simuladorDaAula().executar("0001001").passos().getFirst();

		assertEquals(0, primeiro.numero());
		assertEquals("q0", primeiro.estado());
		assertEquals("B0001001B", primeiro.fita());
		assertEquals(1, primeiro.cabecote());
		assertEquals(MAQUINA_DA_AULA.getFirst(), primeiro.transicao());
	}

	@Test
	void aceitaSemPassosQuandoEstadoInicialEhFinal() {
		var simulador = new SimuladorMaquinaTuring("q0", Set.of("q0"), List.of(), LIMITE_PASSOS);

		ResultadoSimulacao resultado = simulador.executar("101");

		assertTrue(resultado.aceita());
		assertTrue(resultado.passos().isEmpty());
	}

	@Test
	void interrompeMaquinaQueNaoPara() {
		var laco = List.of(new Transicao("q0", 'B', "q0", 'B', Direcao.R));
		var simulador = new SimuladorMaquinaTuring("q0", Set.of("qf"), laco, LIMITE_PASSOS);

		ResultadoSimulacao resultado = simulador.executar("");

		assertFalse(resultado.aceita());
		assertEquals(MotivoParada.LIMITE_DE_PASSOS, resultado.motivo());
		assertEquals(LIMITE_PASSOS, resultado.passos().size());
	}

	@Test
	void recusaTransicoesNaoDeterministicas() {
		var duplicadas = List.of(
				new Transicao("q0", '0', "q0", '0', Direcao.R),
				new Transicao("q0", '0', "q1", '1', Direcao.L));

		assertThrows(ModeloInvalidoException.class,
				() -> new SimuladorMaquinaTuring("q0", Set.of("q1"), duplicadas, LIMITE_PASSOS));
	}
}
