package com.br.unifor.teoria_computacao.turing.api;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(MaquinaTuringController.class)
class MaquinaTuringControllerTest {

	@Autowired
	private MockMvc mockMvc;

	private ResultActions simular(String corpo) throws Exception {
		return mockMvc.perform(post("/api/maquinas-turing/simulacoes").contentType(MediaType.APPLICATION_JSON).content(corpo));
	}

	@Test
	void retornaResultadoDaSimulacao() throws Exception {
		simular("""
				{
				  "cadeia": "01",
				  "estadoInicial": "q0",
				  "estadosFinais": ["qf"],
				  "transicoes": [
				    {"estadoAtual": "q0", "simboloLido": "0", "novoEstado": "q0", "simboloEscrito": "0", "direcao": "R"},
				    {"estadoAtual": "q0", "simboloLido": "1", "novoEstado": "qf", "simboloEscrito": "1", "direcao": "R"}
				  ]
				}
				""")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.aceita").value(true))
				.andExpect(jsonPath("$.motivo").value("ESTADO_FINAL"))
				.andExpect(jsonPath("$.passos.length()").value(2))
				.andExpect(jsonPath("$.passos[0].transicao.simboloLido").value("0"));
	}

	@Test
	void rejeitaCamposInvalidos() throws Exception {
		simular("""
				{
				  "cadeia": "0",
				  "estadoInicial": "",
				  "estadosFinais": [],
				  "transicoes": [
				    {"estadoAtual": "q0", "simboloLido": "00", "novoEstado": "q0", "simboloEscrito": "0", "direcao": "R"}
				  ]
				}
				""")
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.erros.length()").value(3));
	}

	@Test
	void rejeitaCadeiaComSimboloBranco() throws Exception {
		simular("""
				{"cadeia": "0B1", "estadoInicial": "q0", "estadosFinais": ["qf"], "transicoes": []}
				""")
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.erros[0]").value(startsWith("cadeia:")));
	}

	@Test
	void ignoraEspacosNosNomesDosEstados() throws Exception {
		simular("""
				{
				  "cadeia": "1",
				  "estadoInicial": " q0 ",
				  "estadosFinais": ["qf "],
				  "transicoes": [
				    {"estadoAtual": "q0 ", "simboloLido": "1", "novoEstado": " qf", "simboloEscrito": "1", "direcao": "R"}
				  ]
				}
				""")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.aceita").value(true));
	}

	@Test
	void rejeitaDirecaoDesconhecida() throws Exception {
		simular("""
				{
				  "cadeia": "0",
				  "estadoInicial": "q0",
				  "estadosFinais": ["qf"],
				  "transicoes": [
				    {"estadoAtual": "q0", "simboloLido": "0", "novoEstado": "q0", "simboloEscrito": "0", "direcao": "X"}
				  ]
				}
				""")
				.andExpect(status().isBadRequest());
	}

	@Test
	void rejeitaMaquinaNaoDeterministica() throws Exception {
		simular("""
				{
				  "cadeia": "0",
				  "estadoInicial": "q0",
				  "estadosFinais": ["qf"],
				  "transicoes": [
				    {"estadoAtual": "q0", "simboloLido": "0", "novoEstado": "q0", "simboloEscrito": "0", "direcao": "R"},
				    {"estadoAtual": "q0", "simboloLido": "0", "novoEstado": "qf", "simboloEscrito": "1", "direcao": "L"}
				  ]
				}
				""")
				.andExpect(status().isUnprocessableContent());
	}
}
