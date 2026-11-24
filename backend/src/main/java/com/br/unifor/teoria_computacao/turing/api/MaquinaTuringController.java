package com.br.unifor.teoria_computacao.turing.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.unifor.teoria_computacao.turing.dominio.ResultadoSimulacao;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/maquinas-turing/simulacoes")
public class MaquinaTuringController {
	private final int limitePassos;

	public MaquinaTuringController(@Value("${simulador.turing.limite-passos}") int limitePassos) {
		this.limitePassos = limitePassos;
	}

	@PostMapping
	public ResultadoSimulacao simular(@Valid @RequestBody MaquinaTuringRequest request) {
		return request.paraSimulador(limitePassos).executar(request.cadeia());
	}
}
