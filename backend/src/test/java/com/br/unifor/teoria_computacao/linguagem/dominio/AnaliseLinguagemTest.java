package com.br.unifor.teoria_computacao.linguagem.dominio;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.br.unifor.teoria_computacao.compartilhado.ModeloInvalidoException;

class AnaliseLinguagemTest {
	private static final Alfabeto AB = new Alfabeto(List.of('a', 'b'));
	private static final Linguagem L = new Linguagem(AB, List.of("ab", "abba"));

	@Test
	void validaCadeiaDoEnunciado() {
		AnaliseLinguagem analise = AnaliseLinguagem.analisar(L, "abba", "", 2);

		assertTrue(analise.cadeiaValida());
		assertEquals(4, analise.tamanho());
		assertTrue(analise.pertenceALinguagem());
	}

	@Test
	void apontaSimbolosForaDoAlfabeto() {
		AnaliseLinguagem analise = AnaliseLinguagem.analisar(L, "abca", "", 1);

		assertFalse(analise.cadeiaValida());
		assertEquals(List.of(new SimboloInvalido(2, 'c')), analise.simbolosInvalidos());
	}

	@Test
	void enumeraFechosAteOTamanhoMaximo() {
		AnaliseLinguagem analise = AnaliseLinguagem.analisar(L, "", "", 2);

		assertEquals(List.of("", "a", "b", "aa", "ab", "ba", "bb"), analise.fechoKleene());
		assertEquals(List.of("a", "b", "aa", "ab", "ba", "bb"), analise.fechoPositivo());
	}

	@Test
	void concatenaAsCadeias() {
		AnaliseLinguagem analise = AnaliseLinguagem.analisar(L, "ab", "ba", 0);

		assertEquals("abba", analise.concatenacao());
		assertEquals(4, analise.tamanhoConcatenacao());
	}

	@Test
	void recusaEnumeracaoGrandeDemais() {
		var alfabeto = new Alfabeto(List.of('a', 'b', 'c', 'd'));
		var linguagem = new Linguagem(alfabeto, List.of());

		assertThrows(ModeloInvalidoException.class, () -> AnaliseLinguagem.analisar(linguagem, "", "", 10));
	}

	@Test
	void recusaPalavraDaLinguagemForaDoAlfabeto() {
		assertThrows(ModeloInvalidoException.class, () -> new Linguagem(AB, List.of("abc")));
	}
}
