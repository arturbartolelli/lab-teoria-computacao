package com.br.unifor.teoria_computacao.linguagem.api;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.unifor.teoria_computacao.linguagem.dominio.AnaliseLinguagem;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/linguagens/analises")
public class LinguagemController {

	@PostMapping
	public AnaliseLinguagem analisar(@Valid @RequestBody AnaliseLinguagemRequest request) {
		return AnaliseLinguagem.analisar(request.paraLinguagem(), request.cadeia(), request.segundaCadeia(),
				request.tamanhoMaximo());
	}
}
