package com.br.unifor.maquina_turing.api;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.br.unifor.maquina_turing.dominio.MaquinaInvalidaException;

@RestControllerAdvice
public class TratadorDeErros {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ProblemDetail requisicaoInvalida(MethodArgumentNotValidException excecao) {
		List<String> erros = excecao.getBindingResult().getFieldErrors().stream()
				.map(TratadorDeErros::descrever)
				.toList();
		ProblemDetail problema = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Requisição inválida");
		problema.setProperty("erros", erros);
		return problema;
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	ProblemDetail corpoIlegivel() {
		return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
				"Corpo da requisição malformado: verifique o JSON e se a direção é L ou R");
	}

	@ExceptionHandler(MaquinaInvalidaException.class)
	ProblemDetail maquinaInvalida(MaquinaInvalidaException excecao) {
		return ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_CONTENT, excecao.getMessage());
	}

	private static String descrever(FieldError erro) {
		return erro.getField() + ": " + erro.getDefaultMessage();
	}
}
