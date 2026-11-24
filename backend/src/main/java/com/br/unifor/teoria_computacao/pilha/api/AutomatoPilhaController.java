package com.br.unifor.teoria_computacao.pilha.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.unifor.teoria_computacao.pilha.dominio.ResultadoPilha;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/automatos-pilha/simulacoes")
public class AutomatoPilhaController {
	private final int limiteCopias;

	public AutomatoPilhaController(@Value("${simulador.pilha.limite-copias}") int limiteCopias) {
		this.limiteCopias = limiteCopias;
	}

	@PostMapping
	public ResultadoPilha simular(@Valid @RequestBody AutomatoPilhaRequest request) {
		return request.paraAutomato(limiteCopias).executar(request.cadeia());
	}
}
