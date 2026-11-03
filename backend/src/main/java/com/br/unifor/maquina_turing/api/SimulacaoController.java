package com.br.unifor.maquina_turing.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.unifor.maquina_turing.dominio.ResultadoSimulacao;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/simulacoes")
public class SimulacaoController {
	private final int limitePassos;

	public SimulacaoController(@Value("${maquina-turing.limite-passos}") int limitePassos) {
		this.limitePassos = limitePassos;
	}

	@PostMapping
	public ResultadoSimulacao simular(@Valid @RequestBody SimulacaoRequest request) {
		return request.paraSimulador(limitePassos).executar(request.cadeia());
	}
}
