package com.br.unifor.teoria_computacao.compartilhado;

import static java.util.stream.Collectors.toUnmodifiableSet;

import java.util.Collection;
import java.util.Set;

public final class Nomes {

	private Nomes() {
	}

	public static Set<String> limpar(Collection<String> nomes) {
		return nomes.stream().map(String::strip).collect(toUnmodifiableSet());
	}
}
