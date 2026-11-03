package com.br.unifor.maquina_turing.dominio;

public record Passo(int numero, String estado, String fita, int cabecote, Transicao transicao) {
}
