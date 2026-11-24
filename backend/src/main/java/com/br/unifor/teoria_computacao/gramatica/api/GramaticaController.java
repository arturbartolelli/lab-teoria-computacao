package com.br.unifor.teoria_computacao.gramatica.api;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.unifor.teoria_computacao.gramatica.dominio.AnalisadorDescendente;
import com.br.unifor.teoria_computacao.gramatica.dominio.ResultadoDerivacao;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/gramaticas/derivacoes")
public class GramaticaController {

	@PostMapping
	public ResultadoDerivacao derivar(@Valid @RequestBody GramaticaRequest request) {
		return new AnalisadorDescendente(request.paraGramatica(), request.cadeia()).analisar();
	}
}
