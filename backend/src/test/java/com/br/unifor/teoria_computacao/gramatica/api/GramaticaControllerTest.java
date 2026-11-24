package com.br.unifor.teoria_computacao.gramatica.api;

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

@WebMvcTest(GramaticaController.class)
class GramaticaControllerTest {

	@Autowired
	private MockMvc mockMvc;

	private ResultActions derivar(String corpo) throws Exception {
		return mockMvc.perform(post("/api/gramaticas/derivacoes").contentType(MediaType.APPLICATION_JSON).content(corpo));
	}

	@Test
	void aceitaAlternativasNoMesmoCorpo() throws Exception {
		derivar("""
				{"variaveis": ["S"], "terminais": ["a", "b"], "simboloInicial": "S", "cadeia": "aabb",
				 "producoes": [{"cabeca": "S", "corpo": "aSb|"}]}
				""")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.aceita").value(true))
				.andExpect(jsonPath("$.producoes.length()").value(2))
				.andExpect(jsonPath("$.arvore[0].simbolo").value("S"))
				.andExpect(jsonPath("$.arvore[0].pai").value(-1));
	}

	@Test
	void recusaProducaoComSimboloNaoDeclarado() throws Exception {
		derivar("""
				{"variaveis": ["S"], "terminais": ["a"], "simboloInicial": "S", "cadeia": "a",
				 "producoes": [{"cabeca": "S", "corpo": "aX"}]}
				""")
				.andExpect(status().isUnprocessableContent());
	}

	@Test
	void apontaCampoInvalidoPelaLinhaDaProducao() throws Exception {
		derivar("""
				{"variaveis": ["S"], "terminais": ["a"], "simboloInicial": "S", "cadeia": "a",
				 "producoes": [{"cabeca": "S", "corpo": "a|"}, {"cabeca": "SS", "corpo": "a"}]}
				""")
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.erros[0]").value(startsWith("producoes[1].cabeca")));
	}
}
