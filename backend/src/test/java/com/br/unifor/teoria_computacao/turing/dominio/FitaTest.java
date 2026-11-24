package com.br.unifor.teoria_computacao.turing.dominio;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class FitaTest {

	@Test
	void iniciaComBrancosNasBordasECabecoteNoPrimeiroSimbolo() {
		Fita fita = new Fita("01");

		assertEquals("B01B", fita.conteudo());
		assertEquals(1, fita.cabecote());
		assertEquals('0', fita.ler());
	}

	@Test
	void expandeAEsquerdaAoUltrapassarOInicio() {
		Fita fita = new Fita("0");

		fita.mover(Direcao.L);
		fita.mover(Direcao.L);

		assertEquals("BB0B", fita.conteudo());
		assertEquals(0, fita.cabecote());
	}

	@Test
	void expandeADireitaAoUltrapassarOFim() {
		Fita fita = new Fita("0");

		fita.mover(Direcao.R);
		fita.mover(Direcao.R);

		assertEquals("B0BB", fita.conteudo());
		assertEquals(3, fita.cabecote());
	}

	@Test
	void escreveNaPosicaoDoCabecote() {
		Fita fita = new Fita("00");

		fita.escrever('1');

		assertEquals("B10B", fita.conteudo());
	}
}
