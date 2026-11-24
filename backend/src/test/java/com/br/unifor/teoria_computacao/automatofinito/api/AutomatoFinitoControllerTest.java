package com.br.unifor.teoria_computacao.automatofinito.api;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(AutomatoFinitoController.class)
class AutomatoFinitoControllerTest {

	@Autowired
	private MockMvc mockMvc;

	private ResultActions simular(String estadoFinal, String simbolo) throws Exception {
		return mockMvc.perform(post("/api/automatos-finitos/simulacoes").contentType(MediaType.APPLICATION_JSON).content("""
				{"cadeia": "a", "estados": ["q0", "q1"], "estadoInicial": "q0", "estadosFinais": ["%s"],
				 "transicoes": [{"origem": "q0", "simbolo": "%s", "destino": "q1"}]}
				""".formatted(estadoFinal, simbolo)));
	}

	@Test
	void simulaAutomatoDeclarado() throws Exception {
		simular("q1", "a")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.tipo").value("AFD"))
				.andExpect(jsonPath("$.aceita").value(true));
	}

	@Test
	void recusaEstadoFinalForaDeQ() throws Exception {
		simular("q9", "a")
				.andExpect(status().isUnprocessableContent())
				.andExpect(jsonPath("$.detail").value(containsString("q9")));
	}

	@Test
	void descreveErrosEmPortugues() throws Exception {
		simular(" ", "a")
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.erros[0]").value(containsString("não deve estar em branco")));
	}
}
