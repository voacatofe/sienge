// Arquivo com erros propositais para testar o Husky

const nome = 'João';
const idade = 25;

// Erro 1: Variável não declarada
console.log(sobrenome);

// Erro 2: Função mal formatada (sem ponto e vírgula)
function saudacao() {
  return 'Olá ' + nome;
}

// Erro 3: Espaçamento inconsistente
const lista = [1, 2, 3, 4, 5];

// Erro 4: Aspas inconsistentes
const texto = "Misturando 'aspas'";

// Erro 5: Console.log sem ponto e vírgula
console.log(saudacao());

// Erro 6: Indentação inconsistente
if (true) {
  console.log('Sem indentação');
  console.log('Com indentação');
}

// Erro 7: Variável não utilizada
const variavelNaoUsada = 'teste';

// Erro 8: Função sem return explícito
function semReturn() {
  const x = 1 + 1;
  // Sem return
}
