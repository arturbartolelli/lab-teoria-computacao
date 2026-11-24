package com.br.unifor.teoria_computacao.turing.dominio;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import com.br.unifor.teoria_computacao.compartilhado.ModeloInvalidoException;

public class SimuladorMaquinaTuring {
	private final String estadoInicial;
	private final Set<String> estadosFinais;
	private final Map<ChaveTransicao, Transicao> transicoes;
	private final int limitePassos;

	public SimuladorMaquinaTuring(String estadoInicial, Set<String> estadosFinais, List<Transicao> transicoes,
			int limitePassos) {
		if (limitePassos <= 0) {
			throw new IllegalArgumentException("O limite de passos deve ser positivo");
		}
		this.estadoInicial = estadoInicial;
		this.estadosFinais = Set.copyOf(estadosFinais);
		this.transicoes = indexar(transicoes);
		this.limitePassos = limitePassos;
	}

	public ResultadoSimulacao executar(String cadeia) {
		Fita fita = new Fita(cadeia);
		List<Passo> passos = new ArrayList<>();
		String estado = estadoInicial;

		while (!estadosFinais.contains(estado)) {
			if (passos.size() == limitePassos) {
				return encerrar(MotivoParada.LIMITE_DE_PASSOS, estado, fita, passos);
			}
			Optional<Transicao> proxima = transicaoPara(estado, fita.ler());
			if (proxima.isEmpty()) {
				return encerrar(MotivoParada.SEM_TRANSICAO, estado, fita, passos);
			}
			Transicao transicao = proxima.get();
			passos.add(new Passo(passos.size(), estado, fita.conteudo(), fita.cabecote(), transicao));
			fita.escrever(transicao.simboloEscrito());
			fita.mover(transicao.direcao());
			estado = transicao.novoEstado();
		}

		return encerrar(MotivoParada.ESTADO_FINAL, estado, fita, passos);
	}

	private Optional<Transicao> transicaoPara(String estado, char simbolo) {
		return Optional.ofNullable(transicoes.get(new ChaveTransicao(estado, simbolo)));
	}

	private static ResultadoSimulacao encerrar(MotivoParada motivo, String estado, Fita fita, List<Passo> passos) {
		boolean aceita = motivo == MotivoParada.ESTADO_FINAL;
		return new ResultadoSimulacao(aceita, motivo, estado, fita.conteudo(), fita.cabecote(), List.copyOf(passos));
	}

	private static Map<ChaveTransicao, Transicao> indexar(List<Transicao> transicoes) {
		Map<ChaveTransicao, Transicao> indice = new HashMap<>();
		for (Transicao transicao : transicoes) {
			ChaveTransicao chave = new ChaveTransicao(transicao.estadoAtual(), transicao.simboloLido());
			if (indice.putIfAbsent(chave, transicao) != null) {
				throw new ModeloInvalidoException(
						"Transição duplicada para (%s, %s): a máquina deve ser determinística"
								.formatted(chave.estado(), chave.simbolo()));
			}
		}
		return Map.copyOf(indice);
	}

	private record ChaveTransicao(String estado, char simbolo) {
	}
}
