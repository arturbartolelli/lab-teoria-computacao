export interface AnaliseAssintotica {
  modulo: string
  algoritmo: string
  implementacao: string
  melhor: string
  medio: string
  pior: string
  justificativa: string
}

export const ANALISES: readonly AnaliseAssintotica[] = [
  {
    modulo: 'Linguagens',
    algoritmo: 'Validação de w ∈ Σ*',
    implementacao: 'Alfabeto.simbolosInvalidos',
    melhor: 'Ω(n)',
    medio: 'Θ(n)',
    pior: 'O(n)',
    justificativa:
      'Um laço que passa por todos os símbolos, mesmo quando já achou um inválido. Melhor e pior caso têm a mesma ordem.',
  },
  {
    modulo: 'Linguagens',
    algoritmo: 'Pertinência w ∈ L',
    implementacao: 'Linguagem.contem',
    melhor: 'Ω(n)',
    medio: 'Θ(n)',
    pior: 'O(n)',
    justificativa:
      'L é fixa e finita. Ler w e comparar com palavras de L custa um número constante de passos por símbolo.',
  },
  {
    modulo: 'Linguagens',
    algoritmo: 'Concatenação w·v',
    implementacao: 'AnaliseLinguagem.analisar',
    melhor: 'Ω(n)',
    medio: 'Θ(n)',
    pior: 'O(n)',
    justificativa:
      'Aqui n = |w| + |v|. Cada símbolo é copiado uma vez.',
  },
  {
    modulo: 'Linguagens',
    algoritmo: 'Enumeração de Σ* até tamanho n',
    implementacao: 'Alfabeto.cadeias',
    melhor: 'Ω(n·|Σ|ⁿ)',
    medio: 'Θ(n·|Σ|ⁿ)',
    pior: 'O(n·|Σ|ⁿ)',
    justificativa:
      'Para |Σ| ≥ 2 são geradas todas as cadeias, da ordem de |Σ|ⁿ, com até n símbolos cada. Custo exponencial, por isso há o limite de 2000 cadeias.',
  },
  {
    modulo: 'AFD',
    algoritmo: 'Simulação de AFD',
    implementacao: 'AutomatoFinito.executar',
    melhor: 'Ω(1)',
    medio: 'Θ(n)',
    pior: 'O(n)',
    justificativa:
      'Um laço, um passo por símbolo. Melhor: não há transição para o primeiro símbolo. Médio e pior: lê a cadeia inteira.',
  },
  {
    modulo: 'AFN',
    algoritmo: 'Simulação de AFN',
    implementacao: 'AutomatoFinito.executar',
    melhor: 'Ω(1)',
    medio: 'Θ(n)',
    pior: 'O(n)',
    justificativa:
      'O mesmo laço do AFD, com um laço interno pelas cópias em paralelo, no máximo uma por estado. O número de estados é constante, então a ordem não muda.',
  },
  {
    modulo: 'GLC',
    algoritmo: 'Descida recursiva',
    implementacao: 'AnalisadorDescendente.derivar',
    melhor: 'Ω(1)',
    medio: 'Θ(n)',
    pior: 'O(n³)',
    justificativa:
      'Melhor: o primeiro símbolo já não serve. Médio: gramática do enunciado com w = aᵐbᵐ, uma chamada por nível. Pior: n posições e, em cada produção, dois laços aninhados pelos pontos onde cada símbolo pode terminar.',
  },
  {
    modulo: 'GLC',
    algoritmo: 'Árvore e derivação',
    implementacao: 'DerivacaoMaisAEsquerda.de',
    melhor: 'Ω(n)',
    medio: 'Θ(n²)',
    pior: 'O(n²)',
    justificativa:
      'Melhor: uma produção gera w de uma vez, e só é preciso escrevê-la. Médio e pior: da ordem de n passos, e cada um reescreve a forma sentencial, com até n símbolos.',
  },
  {
    modulo: 'AP',
    algoritmo: 'Simulação de AP',
    implementacao: 'AutomatoPilha.executar',
    melhor: 'Ω(1)',
    medio: 'Θ(n²)',
    pior: 'O(kⁿ)',
    justificativa:
      'Melhor: nenhuma cópia consegue ler o início, como ba em aⁿbⁿ. Médio: aⁿbⁿ, da ordem de n cópias, e cada uma copia a pilha e a entrada restante, com até n símbolos. Pior: cada símbolo divide a máquina em mais cópias, e a quantidade cresce exponencialmente (k é constante do autômato). Por isso há o limite de 5000 cópias.',
  },
  {
    modulo: 'MT',
    algoritmo: 'Simulação de MT',
    implementacao: 'SimuladorMaquinaTuring.executar',
    melhor: 'Ω(n)',
    medio: 'Θ(n²)',
    pior: 'sem limite',
    justificativa:
      'Melhor: copia a entrada para a fita e para. Médio: máquina que dá n passos, como a soma, e copia a fita em cada um. Pior: a máquina pode não parar (problema da parada), então o simulador corta em 5000 passos.',
  },
  {
    modulo: 'MT',
    algoritmo: 'Máquina w#w (passos)',
    implementacao: 'exemplo: opção A',
    melhor: 'Ω(1)',
    medio: 'Θ(n²)',
    pior: 'O(n²)',
    justificativa:
      'Melhor: o primeiro símbolo é inválido. Médio e pior: cadeia da linguagem, um vaivém na fita para cada símbolo de w. T(n) = n²/2 + n + 1/2.',
  },
  {
    modulo: 'MT',
    algoritmo: 'Soma unária (passos)',
    implementacao: 'exemplo: opção B',
    melhor: 'Ω(1)',
    medio: 'Θ(n)',
    pior: 'O(n)',
    justificativa:
      'Melhor: entrada que começa com 11, para no segundo símbolo. Médio e pior: atravessa a fita uma vez. T(n) = n + 2.',
  },
]

export const NOTACOES = [
  { simbolo: 'O(g(n))', significado: 'limite assintótico superior, usado no pior caso' },
  { simbolo: 'Ω(g(n))', significado: 'limite assintótico inferior, usado no melhor caso' },
  { simbolo: 'Θ(g(n))', significado: 'limite assintótico estrito: superior e inferior' },
] as const

export const VARIAVEIS = [
  'n = tamanho da entrada, em geral |w|',
  'o modelo (estados, transições, produções) é fixo: entra como constante',
  'T(n) = soma de custo × vezes de cada linha; fica só o termo dominante',
] as const
