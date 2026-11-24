# Simulador de Linguagens Formais e Modelos Computacionais

Projeto prático de **Aspectos Teóricos da Computação**: uma aplicação web para modelar, validar e simular linguagens formais, autômatos finitos (AFD/AFN), gramáticas livres de contexto (GLC), autômatos com pilha (AP) e máquinas de Turing (MT). Ela também traz a análise de complexidade dos algoritmos implementados.

- **Produção:** https://lab-teoria-computacao.onrender.com (plano free: o primeiro acesso após inatividade leva de 30 s a 1 min)
- **Documento técnico:** [`docs/documento-tecnico.pdf`](docs/documento-tecnico.pdf) (fonte em [`docs/documento-tecnico.md`](docs/documento-tecnico.md))

```
.
├── backend/    API Spring Boot 4 (Java 21, Gradle): domínio e algoritmos
├── frontend/   React 19 + Vite + TypeScript: interface estilo terminal
├── docs/       documento técnico
├── Dockerfile  imagem única (frontend servido pelo Spring) para o Render
└── mise.toml   versões de Java/Node e tarefas do projeto
```

## Módulos

| Aba | O que faz | Algoritmo |
| --- | --------- | --------- |
| linguagens formais | define Σ e L; valida w ∈ Σ*; calcula \|w\|, w·v, Σ* e Σ⁺ até um tamanho n; testa w ∈ L | varredura linear + enumeração por camadas |
| afd / afn | estados, inicial, finais e δ; carrega/exporta JSON; mostra o caminho e o diagrama de estados passo a passo | cópias da máquina em paralelo (um conjunto de estados por passo) |
| glc | variáveis, terminais, produções e símbolo inicial; derivação mais à esquerda passo a passo e árvore de derivação | descida recursiva com as produções digitadas |
| autômato com pilha | empilha/desempilha; mostra leitura, estado e conteúdo da pilha a cada passo; não determinístico, aceita por estado final | cópias da máquina em paralelo |
| máquina de turing | fita infinita animada, direções R/L; exemplos de w#w (opção A) e soma unária (opção B) | simulação determinística com limite de passos |
| complexidade | melhor, médio e pior caso de cada algoritmo em O, Ω e Θ | — |

Todas as abas trazem exemplos prontos no seletor **exemplo ❯**. A aba de autômatos também importa e exporta a definição em JSON pelo painel **json › importar / exportar**.

## Como executar

Pré-requisito: [mise](https://mise.jdx.dev). Ele instala Java (Temurin 21) e Node.js 24 nas versões do `mise.toml`.

Na raiz do repositório, na primeira vez:

```bash
mise trust
```

```bash
mise install
```

Subir backend e frontend juntos:

```bash
mise run dev
```

Abra http://localhost:5173. O backend fica em http://localhost:8080, e o Vite repassa `/api` para ele.

Separadamente, um em cada terminal:

```bash
mise run backend:dev
```

```bash
mise run frontend:dev
```

Sem mise, com JDK 21 e Node 20.19+ instalados: `cd backend && ./gradlew bootRun` (no Windows, `.\gradlew.bat bootRun`) e, em outro terminal, `cd frontend && npm install && npm run dev`.

O primeiro build do backend baixa o Gradle e as dependências, por isso demora alguns minutos.

### Testes

```bash
mise run test
```

| Tarefa | O que roda |
| ------ | ---------- |
| `mise run backend:test` | JUnit: os 5 domínios, as APIs de autômatos finitos, gramáticas e MT, e as máquinas do enunciado |
| `mise run frontend:test` | `tsc`, `oxlint` e Vitest |

## Exemplos de entrada e saída

Os exemplos abaixo usam a API diretamente. Na interface, os mesmos casos estão no seletor de exemplos de cada aba.

### 1. Linguagem formal

Entrada `POST /api/linguagens/analises`:

```json
{ "alfabeto": ["a", "b"], "linguagem": ["ab", "abba"], "cadeia": "abba", "segundaCadeia": "ab", "tamanhoMaximo": 2 }
```

Saída (resumo):

```
CADEIA VÁLIDA PARA Σ · Σ = {a, b} · tamanho = 4
w ∈ L: sim · w·v = abbaab · |w·v| = 6
Σ* (até 2) = {λ, a, b, aa, ab, ba, bb}
Σ⁺ (até 2) = {a, b, aa, ab, ba, bb}
```

### 2. Autômato finito

Entrada `POST /api/automatos-finitos/simulacoes`. Este mesmo JSON pode ser colado ou aberto no painel JSON da aba:

```json
{
  "cadeia": "ab",
  "estados": ["q0", "q1", "q2"],
  "estadoInicial": "q0",
  "estadosFinais": ["q2"],
  "transicoes": [
    { "origem": "q0", "simbolo": "a", "destino": "q1" },
    { "origem": "q1", "simbolo": "b", "destino": "q2" }
  ]
}
```

Saída:

```
ACEITA · AFD · q0 → q1 → q2
```

Todo estado usado precisa estar em `estados`. No painel JSON, `cadeia` é opcional, e um campo ausente é apontado pelo nome.

O tipo vira **AFN** quando há transição ε (`"simbolo": ""`) ou mais de um destino para o mesmo par (estado, símbolo). Nesse caso o caminho mostra conjuntos de estados, como `{q0} → {q0, q1} → {q0, q2}`.

### 3. Gramática livre de contexto

Entrada `POST /api/gramaticas/derivacoes`. Corpo vazio = λ, e `|` separa alternativas na mesma linha: `"corpo": "aSb|"` equivale às duas produções abaixo.

```json
{
  "variaveis": ["S"], "terminais": ["a", "b"], "simboloInicial": "S", "cadeia": "aaabbb",
  "producoes": [ { "cabeca": "S", "corpo": "aSb" }, { "cabeca": "S", "corpo": "" } ]
}
```

Saída:

```
ACEITA
S ⇒ aSb ⇒ aaSbb ⇒ aaaSbbb ⇒ aaabbb

S
├── a
├── S
│   ├── a
│   ├── S
│   │   ├── a
│   │   ├── S
│   │   │   └── λ
│   │   └── b
│   └── b
└── b
```

### 4. Autômato com pilha

Entrada `POST /api/automatos-pilha/simulacoes`, para L = { aⁿbⁿ | n ≥ 1 }. A pilha começa vazia. `topo` é o símbolo desempilhado e `empilhar` é o que entra no lugar; `""` é ε:

```json
{
  "cadeia": "aabb", "estadoInicial": "q1", "estadosFinais": ["q4"],
  "transicoes": [
    { "origem": "q1", "simbolo": "", "topo": "", "destino": "q2", "empilhar": "$" },
    { "origem": "q2", "simbolo": "a", "topo": "", "destino": "q2", "empilhar": "a" },
    { "origem": "q2", "simbolo": "b", "topo": "a", "destino": "q3", "empilhar": "" },
    { "origem": "q3", "simbolo": "b", "topo": "a", "destino": "q3", "empilhar": "" },
    { "origem": "q3", "simbolo": "", "topo": "$", "destino": "q4", "empilhar": "" }
  ]
}
```

Saída:

| # | leitura | estado | restante | pilha (topo à esquerda) |
|---|---------|--------|----------|-------------------------|
| 0 | — | q1 | aabb | ε |
| 1 | ε | q2 | aabb | $ |
| 2 | a | q2 | abb | a$ |
| 3 | a | q2 | bb | aa$ |
| 4 | b | q3 | b | a$ |
| 5 | b | q3 | ε | $ |
| 6 | ε | q4 | ε | ε |

Resultado: **ACEITA**.

### 5. Máquina de Turing

Opção B, soma unária: `000100` representa 3 + 2.

```json
{
  "cadeia": "000100", "estadoInicial": "q0", "estadosFinais": ["q3"],
  "transicoes": [
    { "estadoAtual": "q0", "simboloLido": "0", "novoEstado": "q0", "simboloEscrito": "0", "direcao": "R" },
    { "estadoAtual": "q0", "simboloLido": "1", "novoEstado": "q1", "simboloEscrito": "0", "direcao": "R" },
    { "estadoAtual": "q1", "simboloLido": "0", "novoEstado": "q1", "simboloEscrito": "0", "direcao": "R" },
    { "estadoAtual": "q1", "simboloLido": "B", "novoEstado": "q2", "simboloEscrito": "B", "direcao": "L" },
    { "estadoAtual": "q2", "simboloLido": "0", "novoEstado": "q3", "simboloEscrito": "B", "direcao": "R" }
  ]
}
```

Saída: **ACEITA**, fita final `00000` (5), em 8 passos. A API devolve a fita com os brancos das pontas (`B00000BB`); a interface os remove.

A opção A, L = { w#w }, está no seletor de exemplos com 22 transições. Ela aceita `0110#0110` em 50 passos e rejeita `01#0` e `0#01`. São 2·|w|² + 4·|w| + 2 passos, então o limite de 5000 permite |w| ≤ 49; acima disso o resultado é INDETERMINADA.

### 6. Complexidade

Na aba **complexidade** e no documento técnico. Resumo:

| Algoritmo | Melhor | Médio | Pior |
| --------- | ------ | ----- | ---- |
| Validação de w ∈ Σ\* | Ω(n) | Θ(n) | O(n) |
| Pertinência w ∈ L | Ω(n) | Θ(n) | O(n) |
| Concatenação w·v | Ω(n) | Θ(n) | O(n) |
| Enumeração de Σ\* até tamanho n | Ω(n·\|Σ\|ⁿ) | Θ(n·\|Σ\|ⁿ) | O(n·\|Σ\|ⁿ) |
| Simulação de AFD | Ω(1) | Θ(n) | O(n) |
| Simulação de AFN | Ω(1) | Θ(n) | O(n) |
| Descida recursiva | Ω(1) | Θ(n) | O(n³) |
| Árvore e derivação | Ω(n) | Θ(n²) | O(n²) |
| Simulação de AP | Ω(1) | Θ(n²) | O(kⁿ) |
| Simulação de MT | Ω(n) | Θ(n²) | sem limite |
| Máquina w#w (passos) | Ω(1) | Θ(n²) | O(n²) |
| Soma unária (passos) | Ω(1) | Θ(n) | O(n) |

n é o tamanho da entrada e o modelo é fixo. A análise linha a linha está na seção 5 do documento técnico.

## API

| Endpoint | Corpo | Resposta |
| -------- | ----- | -------- |
| `POST /api/linguagens/analises` | `alfabeto`, `linguagem`, `cadeia`, `segundaCadeia`, `tamanhoMaximo` (0–10) | validação, tamanho, concatenação, Σ*, Σ⁺ |
| `POST /api/automatos-finitos/simulacoes` | `cadeia`, `estados`, `estadoInicial`, `estadosFinais`, `transicoes[origem, simbolo, destino]` | tipo (AFD/AFN), aceita, passos |
| `POST /api/gramaticas/derivacoes` | `variaveis`, `terminais`, `simboloInicial`, `producoes[cabeca, corpo]`, `cadeia` | aceita, derivação, árvore |
| `POST /api/automatos-pilha/simulacoes` | `cadeia`, `estadoInicial`, `estadosFinais`, `transicoes[origem, simbolo, topo, destino, empilhar]` | aceita, motivo, passos |
| `POST /api/maquinas-turing/simulacoes` | `cadeia`, `estadoInicial`, `estadosFinais`, `transicoes[estadoAtual, simboloLido, novoEstado, simboloEscrito, direcao]` | aceita, motivo, fita, passos |

Regras gerais:
- Símbolos têm exatamente 1 caractere.
- Texto vazio (`""`) representa ε ou λ.
- Na interface, `,` e espaço separam listas (Σ, V, T e estados), e `|` separa alternativas de produção. Por isso esses três caracteres não podem ser símbolos.
- Nomes de estado têm os espaços das pontas removidos.
- Erros de validação retornam `400` com a lista `erros`. JSON malformado ou direção diferente de L e R também retorna `400`, só com a mensagem geral.
- Modelos inconsistentes retornam `422`. Exemplos: estado fora de Q, MT não determinística, produção com símbolo não declarado, gramática com recursão à esquerda, palavra de L fora de Σ.

Limites, configuráveis em `backend/src/main/resources/application.properties`:

| Propriedade | Padrão |
| ----------- | ------ |
| `simulador.turing.limite-passos` | 5000 |
| `simulador.pilha.limite-copias` | 5000 |

Limites fixos: cadeia com até 500 símbolos (100 na GLC), 500 transições, 200 estados no AF, 200 produções, alfabeto com até 100 símbolos, 200 palavras em L e 2000 cadeias na enumeração de Σ*.

## Deploy no Render

O `Dockerfile` compila o frontend, copia o `dist/` para `static/` do Spring Boot e gera uma imagem com JRE 21. Página e API ficam no mesmo domínio. O `render.yaml` define o serviço (Docker, plano free). Cada push na `main` faz um novo deploy.

Para testar a imagem localmente:

```bash
docker build -t lab-teoria-computacao .
```

```bash
docker run --rm -p 8080:8080 lab-teoria-computacao
```
