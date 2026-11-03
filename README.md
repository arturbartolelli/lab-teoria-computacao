# Simulador de Máquina de Turing

Monorepo com o simulador de Máquina de Turing determinística em Java (Spring Boot) e uma página web em React que envia a cadeia e as transições para a API e reproduz a execução passo a passo.

```
.
├── backend/    API Spring Boot 4 (Java 21, Gradle)
├── frontend/   React 19 + Vite 8 + TypeScript
└── mise.toml   versões de Java/Node e tarefas do projeto
```

## Pré-requisitos

- [mise](https://mise.jdx.dev) instalado.

O `mise.toml` fixa as versões das ferramentas:

| Ferramenta | Versão |
| ---------- | ------ |
| Java       | Temurin 21 |
| Node.js    | 24 (LTS) |

## Primeira execução

Na raiz do repositório:

```bash
mise trust
```

```bash
mise install
```

O primeiro build do backend baixa o Gradle e as dependências do Spring Boot, por isso demora alguns minutos. Os seguintes levam segundos.

## Rodando localmente

### Tudo junto

```bash
mise run dev
```

Sobe o backend em `http://localhost:8080` e o frontend em `http://localhost:5173`. Abra `http://localhost:5173` no navegador.

### Separadamente

Em um terminal:

```bash
mise run backend:dev
```

Em outro terminal:

```bash
mise run frontend:dev
```

### Sem mise

Backend (precisa de JDK 21 no `PATH`):

```bash
cd backend && ./gradlew bootRun
```

No Windows (cmd ou PowerShell), dentro de `backend`: `.\gradlew.bat bootRun`.

Frontend (precisa de Node 20.19+ ou 22.12+):

```bash
cd frontend && npm install && npm run dev
```

## Testes

```bash
mise run test
```

| Tarefa | O que roda |
| ------ | ---------- |
| `mise run backend:test` | JUnit: fita, simulador e controller |
| `mise run frontend:test` | `tsc`, `oxlint` e Vitest |

## Como testar manualmente

1. Rode `mise run dev` e abra `http://localhost:5173`.
2. A página abre com a máquina da aula carregada: estado inicial `q0`, final `q3` e cadeia `0001001`.
3. Clique em `[ executar ]`. O resultado deve ser **ACEITA**, com 8 passos.
4. Use `[ reproduzir ]`, `<` / `>` ou a barra de tempo para acompanhar o cabeçote na fita.
5. Troque a cadeia para `000100` e execute de novo. O resultado deve ser **REJEITADA**: não há transição para `δ(q1, B)`.
6. Duplique uma transição (mesmo estado e mesmo símbolo lido) e execute: a API recusa a máquina por não ser determinística.

## API

`POST /api/simulacoes`

```json
{
  "cadeia": "0001001",
  "estadoInicial": "q0",
  "estadosFinais": ["q3"],
  "transicoes": [
    { "estadoAtual": "q0", "simboloLido": "0", "novoEstado": "q0", "simboloEscrito": "0", "direcao": "R" }
  ]
}
```

Resposta `200`:

```json
{
  "aceita": true,
  "motivo": "ESTADO_FINAL",
  "estadoDeParada": "q3",
  "fitaFinal": "B00000BBB",
  "cabecoteFinal": 7,
  "passos": [
    { "numero": 0, "estado": "q0", "fita": "B0001001B", "cabecote": 1, "transicao": { "...": "..." } }
  ]
}
```

| Campo | Regra |
| ----- | ----- |
| `cadeia` | obrigatório, até 500 símbolos, pode ser vazio (ε); não aceita espaços nem `B` |
| `estadosFinais` | ao menos um estado |
| `transicoes` | até 500 |
| `simboloLido` / `simboloEscrito` | exatamente 1 caractere que não seja espaço; `B` é o branco |
| `direcao` | `L` ou `R` |

Nomes de estado têm os espaços das pontas removidos. `estadoDeParada` é o estado em que a máquina parou.

`motivo` pode ser:

| Valor | Significado | Página mostra |
| ----- | ----------- | ------------- |
| `ESTADO_FINAL` | alcançou um estado final | **ACEITA** |
| `SEM_TRANSICAO` | parou sem transição definida | **REJEITADA** |
| `LIMITE_DE_PASSOS` | não parou dentro do limite (provável laço infinito) | **INDETERMINADA** |

O limite fica em `maquina-turing.limite-passos` no `backend/src/main/resources/application.properties` (padrão 1000).

Erros:

| Status | Quando |
| ------ | ------ |
| `400` | campo inválido ou JSON malformado; o corpo traz `erros` por campo (`transicoes[0]` é a primeira transição) |
| `422` | transições duplicadas para o mesmo par (estado, símbolo) |

Teste direto pela linha de comando:

```bash
curl -X POST http://localhost:8080/api/simulacoes -H "Content-Type: application/json" -d '{"cadeia":"01","estadoInicial":"q0","estadosFinais":["qf"],"transicoes":[{"estadoAtual":"q0","simboloLido":"0","novoEstado":"q0","simboloEscrito":"0","direcao":"R"},{"estadoAtual":"q0","simboloLido":"1","novoEstado":"qf","simboloEscrito":"1","direcao":"R"}]}'
```

## Deploy no Render

O `Dockerfile` da raiz gera uma única imagem: compila o frontend, copia o `dist/` para `backend/src/main/resources/static` e empacota tudo no jar do Spring Boot. Página e API ficam no mesmo domínio, sem CORS.

| Arquivo | Papel |
| ------- | ----- |
| `Dockerfile` | build em 3 estágios (Node → Gradle → JRE) |
| `.dockerignore` | evita enviar `node_modules`, `build` etc. ao build |
| `render.yaml` | Blueprint do Render: web service Docker, plano free |

O backend escuta na porta da variável `PORT` (o Render define essa variável) e usa 8080 quando ela não existe.

1. Suba o repositório para o GitHub.
2. No Render: **New → Blueprint**, escolha o repositório e confirme. O Render lê o `render.yaml`.
3. Aguarde o build (alguns minutos na primeira vez) e abra a URL `https://<nome>.onrender.com`.

No plano free o serviço dorme após ~15 min sem acesso; o primeiro acesso depois disso leva de 30 s a 1 min.

Para testar a imagem localmente (precisa de Docker):

```bash
docker build -t lab-teoria-computacao .
```

```bash
docker run --rm -p 8080:8080 lab-teoria-computacao
```

## Comunicação frontend ↔ backend

Em desenvolvimento o Vite faz proxy de `/api` para `http://localhost:8080` (ver `frontend/vite.config.ts`). O navegador fala só com a origem do Vite, então não há CORS nem certificado para configurar localmente. Em produção, sirva o `frontend/dist` atrás do mesmo domínio da API com HTTPS terminado no proxy reverso (Nginx, Caddy etc.).
