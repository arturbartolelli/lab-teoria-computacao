package com.br.unifor.teoria_computacao.gramatica.dominio;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.br.unifor.teoria_computacao.compartilhado.ModeloInvalidoException;

public class AnalisadorDescendente {
	private final Gramatica gramatica;
	private final String cadeia;
	private final Map<String, Map<Integer, NoDerivacao>> calculados = new HashMap<>();
	private final Set<String> emAndamento = new HashSet<>();

	public AnalisadorDescendente(Gramatica gramatica, String cadeia) {
		this.gramatica = gramatica;
		this.cadeia = cadeia;
	}

	public ResultadoDerivacao analisar() {
		NoDerivacao raiz = derivar(gramatica.simboloInicial(), 0).get(cadeia.length());
		List<String> producoes = gramatica.producoes().stream().map(Producao::toString).toList();
		if (raiz == null) {
			return new ResultadoDerivacao(false, cadeia, producoes, List.of(), List.of());
		}
		return new ResultadoDerivacao(true, cadeia, producoes, DerivacaoMaisAEsquerda.de(raiz), NoArvore.achatar(raiz));
	}

	private Map<Integer, NoDerivacao> derivar(char variavel, int posicao) {
		String chamada = variavel + " na posição " + posicao;
		if (calculados.containsKey(chamada)) {
			return calculados.get(chamada);
		}
		if (!emAndamento.add(chamada)) {
			throw new ModeloInvalidoException(
					"A gramática tem recursão à esquerda na variável %s; reescreva a produção".formatted(variavel));
		}
		Map<Integer, NoDerivacao> arvores = new LinkedHashMap<>();
		for (Producao producao : gramatica.producoesDe(variavel)) {
			casar(producao, posicao)
					.forEach((fim, filhos) -> arvores.putIfAbsent(fim, NoDerivacao.variavel(variavel, filhos)));
		}
		emAndamento.remove(chamada);
		calculados.put(chamada, arvores);
		return arvores;
	}

	private Map<Integer, List<NoDerivacao>> casar(Producao producao, int inicio) {
		if (producao.tamanho() == 0) {
			return Map.of(inicio, List.of(NoDerivacao.lambda()));
		}
		Map<Integer, List<NoDerivacao>> parciais = Map.of(inicio, List.of());
		for (int i = 0; i < producao.tamanho(); i++) {
			parciais = avancar(parciais, producao.simbolo(i));
		}
		return parciais;
	}

	private Map<Integer, List<NoDerivacao>> avancar(Map<Integer, List<NoDerivacao>> parciais, char simbolo) {
		Map<Integer, List<NoDerivacao>> proximos = new LinkedHashMap<>();
		parciais.forEach((posicao, filhos) -> reconhecer(simbolo, posicao)
				.forEach((fim, no) -> proximos.putIfAbsent(fim, acrescentar(filhos, no))));
		return proximos;
	}

	private Map<Integer, NoDerivacao> reconhecer(char simbolo, int posicao) {
		if (gramatica.ehVariavel(simbolo)) {
			return derivar(simbolo, posicao);
		}
		boolean leu = posicao < cadeia.length() && cadeia.charAt(posicao) == simbolo;
		return leu ? Map.of(posicao + 1, NoDerivacao.folha(simbolo)) : Map.of();
	}

	private static List<NoDerivacao> acrescentar(List<NoDerivacao> filhos, NoDerivacao no) {
		List<NoDerivacao> resultado = new ArrayList<>(filhos);
		resultado.add(no);
		return resultado;
	}
}
