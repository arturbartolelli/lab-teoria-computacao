package com.br.unifor.teoria_computacao.gramatica.dominio;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import com.br.unifor.teoria_computacao.compartilhado.ModeloInvalidoException;

class AnalisadorDescendenteTest {

	private static final Gramatica ANBN = new Gramatica(Set.of('S'), Set.of('a', 'b'), 'S', List.of(
			new Producao('S', "aSb"),
			new Producao('S', "")));

	private static final Gramatica PALINDROMOS = new Gramatica(Set.of('S'), Set.of('a', 'b'), 'S', List.of(
			new Producao('S', "aSa"),
			new Producao('S', "bSb"),
			new Producao('S', "a"),
			new Producao('S', "b"),
			new Producao('S', "")));

	private static final Gramatica EXPRESSOES = new Gramatica(Set.of('E', 'X', 'T', 'Y', 'F'),
			Set.of('+', '*', '(', ')', 'x'), 'E', List.of(
					new Producao('E', "TX"),
					new Producao('X', "+TX"),
					new Producao('X', ""),
					new Producao('T', "FY"),
					new Producao('Y', "*FY"),
					new Producao('Y', ""),
					new Producao('F', "(E)"),
					new Producao('F', "x")));

	private static ResultadoDerivacao analisar(Gramatica gramatica, String cadeia) {
		return new AnalisadorDescendente(gramatica, cadeia).analisar();
	}

	private static List<String> formas(ResultadoDerivacao resultado) {
		return resultado.derivacao().stream().map(PassoDerivacao::formaSentencial).toList();
	}

	@Test
	void aceitaExemploDoEnunciadoComDerivacao() {
		ResultadoDerivacao resultado = analisar(ANBN, "aaabbb");

		assertTrue(resultado.aceita());
		assertEquals(List.of("S", "aSb", "aaSbb", "aaaSbbb", "aaabbb"), formas(resultado));
		assertEquals("S → λ", resultado.derivacao().getLast().producao());
	}

	@Test
	void montaArvoreDoExemploDoEnunciado() {
		List<NoArvore> nos = analisar(ANBN, "ab").arvore();

		assertEquals(NoArvore.SEM_PAI, nos.getFirst().pai());
		assertEquals(List.of("S", "a", "S", "λ", "b"), nos.stream().map(NoArvore::simbolo).toList());
		assertEquals(List.of(-1, 0, 0, 2, 0), nos.stream().map(NoArvore::pai).toList());
	}

	@Test
	void aceitaCadeiaVaziaPorProducaoLambda() {
		ResultadoDerivacao resultado = analisar(ANBN, "");

		assertTrue(resultado.aceita());
		assertEquals("λ", resultado.derivacao().getLast().formaSentencial());
	}

	@ParameterizedTest
	@ValueSource(strings = { "aab", "ba", "abb", "c", "aabba" })
	void rejeitaCadeiaForaDaLinguagem(String cadeia) {
		ResultadoDerivacao resultado = analisar(ANBN, cadeia);

		assertFalse(resultado.aceita());
		assertTrue(resultado.arvore().isEmpty());
		assertTrue(resultado.derivacao().isEmpty());
	}

	@ParameterizedTest
	@ValueSource(strings = { "", "a", "abba", "abbba", "bab" })
	void tentaOutrasProducoesQuandoUmaFalha(String cadeia) {
		assertTrue(analisar(PALINDROMOS, cadeia).aceita());
	}

	@ParameterizedTest
	@ValueSource(strings = { "x", "x+x*x", "x+x*(x+x)", "((x))" })
	void aceitaExpressoes(String cadeia) {
		ResultadoDerivacao resultado = analisar(EXPRESSOES, cadeia);

		assertTrue(resultado.aceita());
		assertEquals(cadeia, resultado.derivacao().getLast().formaSentencial());
	}

	@ParameterizedTest
	@ValueSource(strings = { "x+", "(x", "x)", "+x", "xx" })
	void rejeitaExpressoesInvalidas(String cadeia) {
		assertFalse(analisar(EXPRESSOES, cadeia).aceita());
	}

	@Test
	void suportaCadeiaDeTamanhoMaximo() {
		assertTrue(analisar(ANBN, "a".repeat(50) + "b".repeat(50)).aceita());
		assertTrue(analisar(PALINDROMOS, "a".repeat(100)).aceita());
	}

	@Test
	void recusaRecursaoAEsquerda() {
		var gramatica = new Gramatica(Set.of('E'), Set.of('+', 'x'), 'E', List.of(
				new Producao('E', "E+x"),
				new Producao('E', "x")));

		var erro = assertThrows(ModeloInvalidoException.class, () -> analisar(gramatica, "x+x"));

		assertTrue(erro.getMessage().contains("recursão à esquerda"));
	}

	@Test
	void recusaProducaoComSimboloNaoDeclarado() {
		assertThrows(ModeloInvalidoException.class,
				() -> new Gramatica(Set.of('S'), Set.of('a'), 'S', List.of(new Producao('S', "aXb"))));
	}
}
