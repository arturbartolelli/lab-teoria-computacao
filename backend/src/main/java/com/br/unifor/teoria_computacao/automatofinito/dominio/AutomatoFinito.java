package com.br.unifor.teoria_computacao.automatofinito.dominio;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import com.br.unifor.teoria_computacao.compartilhado.ModeloInvalidoException;

public class AutomatoFinito {
	private final Set<String> estados;
	private final String estadoInicial;
	private final Set<String> estadosFinais;
	private final List<TransicaoAutomato> transicoes;

	public AutomatoFinito(Set<String> estados, String estadoInicial, Set<String> estadosFinais,
			List<TransicaoAutomato> transicoes) {
		this.estados = new TreeSet<>(estados);
		this.estadoInicial = estadoInicial;
		this.estadosFinais = new TreeSet<>(estadosFinais);
		this.transicoes = List.copyOf(new LinkedHashSet<>(transicoes));
		validar();
	}

	public TipoAutomato tipo() {
		Set<String> pares = new HashSet<>();
		for (TransicaoAutomato transicao : transicoes) {
			boolean parRepetido = !pares.add(transicao.origem() + " " + transicao.simbolo());
			if (transicao.vazia() || parRepetido) {
				return TipoAutomato.AFN;
			}
		}
		return TipoAutomato.AFD;
	}

	public ResultadoAutomato executar(String cadeia) {
		Set<String> atuais = fechoVazio(Set.of(estadoInicial));
		List<String> iniciaisAtivos = List.copyOf(atuais);
		List<TransicaoAutomato> vaziasIniciais = transicoesCom(atuais, TransicaoAutomato.VAZIO);
		List<PassoAutomato> passos = new ArrayList<>();

		for (int posicao = 0; posicao < cadeia.length() && !atuais.isEmpty(); posicao++) {
			String simbolo = String.valueOf(cadeia.charAt(posicao));
			List<TransicaoAutomato> usadas = transicoesCom(atuais, simbolo);
			Set<String> proximos = fechoVazio(destinos(usadas));
			passos.add(new PassoAutomato(posicao + 1, simbolo, List.copyOf(atuais), List.copyOf(proximos), usadas,
					transicoesCom(proximos, TransicaoAutomato.VAZIO)));
			atuais = proximos;
		}

		boolean consumiuTudo = passos.size() == cadeia.length();
		boolean aceita = consumiuTudo && atuais.stream().anyMatch(estadosFinais::contains);
		return new ResultadoAutomato(cadeia, tipo(), aceita, List.copyOf(estados), estadoInicial,
				List.copyOf(estadosFinais), transicoes, iniciaisAtivos, vaziasIniciais, passos, passos.size());
	}

	private List<TransicaoAutomato> transicoesCom(Set<String> origens, String simbolo) {
		return transicoes.stream()
				.filter(transicao -> origens.contains(transicao.origem()) && transicao.simbolo().equals(simbolo))
				.toList();
	}

	private static Set<String> destinos(List<TransicaoAutomato> usadas) {
		Set<String> destinos = new HashSet<>();
		for (TransicaoAutomato transicao : usadas) {
			destinos.add(transicao.destino());
		}
		return destinos;
	}

	private Set<String> fechoVazio(Set<String> origens) {
		Set<String> fecho = new TreeSet<>(origens);
		boolean cresceu = true;
		while (cresceu) {
			cresceu = fecho.addAll(destinos(transicoesCom(fecho, TransicaoAutomato.VAZIO)));
		}
		return fecho;
	}

	private void validar() {
		exigirEstado(estadoInicial);
		estadosFinais.forEach(this::exigirEstado);
		for (TransicaoAutomato transicao : transicoes) {
			exigirEstado(transicao.origem());
			exigirEstado(transicao.destino());
		}
	}

	private void exigirEstado(String estado) {
		if (!estados.contains(estado)) {
			throw new ModeloInvalidoException("O estado %s é usado no autômato, mas não está em Q = {%s}"
					.formatted(estado, String.join(", ", estados)));
		}
	}
}
