package com.br.unifor.teoria_computacao.automatofinito.dominio;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.br.unifor.teoria_computacao.compartilhado.ModeloInvalidoException;

class AutomatoFinitoTest {

	private static final Set<String> Q = Set.of("q0", "q1", "q2");

	private static final AutomatoFinito AFD_DO_ENUNCIADO = new AutomatoFinito(Q, "q0", Set.of("q2"), List.of(
			new TransicaoAutomato("q0", "a", "q1"),
			new TransicaoAutomato("q1", "b", "q2")));

	private static final AutomatoFinito AFN_TERMINA_EM_AB = new AutomatoFinito(Q, "q0", Set.of("q2"), List.of(
			new TransicaoAutomato("q0", "a", "q0"),
			new TransicaoAutomato("q0", "b", "q0"),
			new TransicaoAutomato("q0", "a", "q1"),
			new TransicaoAutomato("q1", "b", "q2")));

	@Test
	void aceitaComCaminhoDoEnunciado() {
		ResultadoAutomato resultado = AFD_DO_ENUNCIADO.executar("ab");

		assertEquals(TipoAutomato.AFD, resultado.tipo());
		assertTrue(resultado.aceita());
		assertEquals(List.of("q1"), resultado.passos().get(0).estadosAtuais());
		assertEquals(List.of("q2"), resultado.passos().get(1).estadosAtuais());
	}

	@Test
	void rejeitaQuandoFaltaTransicao() {
		ResultadoAutomato resultado = AFD_DO_ENUNCIADO.executar("abb");

		assertFalse(resultado.aceita());
		assertTrue(resultado.passos().getLast().estadosAtuais().isEmpty());
	}

	@Test
	void simulaAfnPorConjuntosDeEstados() {
		ResultadoAutomato resultado = AFN_TERMINA_EM_AB.executar("bab");

		assertEquals(TipoAutomato.AFN, resultado.tipo());
		assertTrue(resultado.aceita());
		assertEquals(List.of("q0", "q1"), resultado.passos().get(1).estadosAtuais());
	}

	@Test
	void seguemTransicoesVazias() {
		var automato = new AutomatoFinito(Q, "q0", Set.of("q2"), List.of(
				new TransicaoAutomato("q0", "", "q1"),
				new TransicaoAutomato("q1", "a", "q2")));

		ResultadoAutomato resultado = automato.executar("a");

		assertEquals(List.of("q0", "q1"), resultado.estadosIniciaisAtivos());
		assertEquals(List.of(new TransicaoAutomato("q0", "", "q1")), resultado.transicoesVaziasIniciais());
		assertTrue(resultado.aceita());
	}

	@Test
	void registraTransicoesVaziasUsadasEmCadaPasso() {
		var automato = new AutomatoFinito(Q, "q0", Set.of("q2"), List.of(
				new TransicaoAutomato("q0", "a", "q1"),
				new TransicaoAutomato("q1", "", "q2")));

		PassoAutomato passo = automato.executar("a").passos().getFirst();

		assertEquals(List.of("q1", "q2"), passo.estadosAtuais());
		assertEquals(List.of(new TransicaoAutomato("q0", "a", "q1")), passo.transicoes());
		assertEquals(List.of(new TransicaoAutomato("q1", "", "q2")), passo.transicoesVazias());
	}

	@Test
	void recusaEstadoNaoDeclarado() {
		var erro = assertThrows(ModeloInvalidoException.class,
				() -> new AutomatoFinito(Q, "q0", Set.of("q9"), List.of()));

		assertTrue(erro.getMessage().contains("q9"));
	}

	@Test
	void listaEstadosDoAutomato() {
		assertEquals(List.of("q0", "q1", "q2"), AFD_DO_ENUNCIADO.executar("").estados());
	}
}
