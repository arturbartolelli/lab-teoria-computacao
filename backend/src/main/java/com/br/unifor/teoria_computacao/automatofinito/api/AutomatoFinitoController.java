package com.br.unifor.teoria_computacao.automatofinito.api;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.unifor.teoria_computacao.automatofinito.dominio.ResultadoAutomato;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/automatos-finitos/simulacoes")
public class AutomatoFinitoController {

	@PostMapping
	public ResultadoAutomato simular(@Valid @RequestBody AutomatoFinitoRequest request) {
		return request.paraAutomato().executar(request.cadeia());
	}
}
