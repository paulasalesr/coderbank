class User{
  constructor(name = "", installments = 0, debt = 0.0, totalInstallments = [], maxInstallments = 10){
    this.minInstallments = 2;
    this.minInstallmentsFreeTax = 3;
    this.maxInstallments = maxInstallments;
    this.name = name;
    this.installments = installments;
    this.debt = debt;
    this.totalInstallments = totalInstallments;
  }
  setName(name){
    this.name = name;
  }
  setInstallments(installments){
    this.installments = installments;
  }
  setDebt(debt){
    this.debt = debt;
  }
  getTotalInstallments(){
    return this.totalInstallments;
  }
  calculate(){
    if(this.installments < this.minInstallments || this.installments > this.maxInstallments){
      alert(this.name + 
        ", o número mínimo de parcelas é " + 
        this.minInstallments + 
        " e o máximo é " + 
        this.maxInstallments + 
        "! Por favor, insira um número de parcelas válido."
      );
    }else{
      alert("Resultado: " + this.debt/this.installments);
      this.totalInstallments.push(
        {
          nInstallment: this.installments,
          installments: this.debt/this.installments,
          debtWithInterest: null,
          installmentWithInterest: null
        }
      );
    }
  }
}

let client = new User();
const interestRate = 0.05;

// let botao = document.getElementById("button");
// console.log(botao);
// botao.addEventListener("click", dados)

function dados() {
  let name = document.getElementById('textArea').value; 
  // document.getElementById('textArea');
  console.log(name)
  // let name = prompt("Por favor, insira seu nome: ", "Coder Estudante");
  client.setName(name);  
  if (client.name == "") {
    document.getElementById("text").innerHTML = "Usuário cancelou a simulação."
  } else {
    document.getElementById("text").innerHTML = "Olá, " + client.name + "! " + "Vamos iniciar a simulação das parcelas. "
  }
}

function computeInstallmentWithInterest(debt = 0, {nInstallment}){
  if((debt ?? "Nullish") || (nInstallment ?? "Nullish")){
    return (debt * Math.pow(1 + interestRate, nInstallment));
  }
  return null
}

// function getStandardDeviation (array) {
//   const n = array.length
//   const mean = array.reduce((a, b) => a + b) / n
//   return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
// }

function showResults(){
  let all_data = JSON.parse(sessionStorage.getItem('all_data'));
  let results = JSON.parse(sessionStorage.getItem('results'));
  for (const data of all_data) {
    let container = document.createElement("div");
    if(data?.total_com_juros){
      container.innerHTML = "<h3> " + data.total + "</h3>" +
      "<p> " + data.n_parcelas + "</p>" +
      "<p> " + data.parcela + "</p>" +
      "<p> " + data.total_com_juros + "</p>" +
      "<p> " + data.parcela_com_juros + "</p>" +
      "<p>" + data.obs + "</p><br><br>"
    }else{
      container.innerHTML = "<h3> " + data.total + "</h3>" +
      "<p> " + data.n_parcelas + "</p>" +
      "<p> " + data.parcela + "</p><br><br>"
    }
    document.body.append(container);
  }
  
  for (const result of results) {
    let container = document.createElement("div");
    container.innerHTML = "<h3> " + result.simulados + "</h3>" +
    "<p> " + result.min_valor_devido + "</p>" +
    "<p> " + result.max_valor_devido + "</p><br><br>"
    document.body.append(container);
  }
}

function parcelas() {
  let debt = parseFloat(document.getElementById('debt').value); 
  client.setName(client?.name == "" ? "Coder Estudante" : client?.name);
  let installments = "";
  // let debt = parseFloat(prompt("Inserir o valor total a ser dividido: "));
  client.setDebt(debt);
  installments = document.getElementById('installments').value; 
  client.setInstallments(installments);
  client.installments = parseFloat(client.installments);
  client.calculate();

  // do {
  //   installments = document.getElementById('installments').value; 
  //   // installments = prompt("Em quantas vezes deseja parcelar (min " + client.minInstallments + ", max. " + client.maxInstallments + ")?: \nOBS: Digite 'sair' para cancelar a operação.");
  //   if(installments != "sair"){
  //     client.setInstallments(installments);
  //     client.installments = parseFloat(client.installments);
  //     client.calculate();
  //     console.log(client.installments);
  //   }
  // }while (installments != "sair");

  let clientDebt = client?.debt
  let allInstallments = [];
  let all_data = [];
  let results = [];
  let data = {};
  let result = {};

  client?.totalInstallments.forEach( o => {
    if(o.nInstallment > client.minInstallmentsFreeTax){ // Cobra juros se o número de parcelas for maior que o minimo sem juros
      o.debtWithInterest = computeInstallmentWithInterest(clientDebt, o);
      o.installmentWithInterest = o.debtWithInterest/o.nInstallment;
      data = {
        "total": "Total" + client.debt,
        "n_parcelas": "Número de Parcelas: " + o.nInstallment,
        "parcela": "Parcela: " + o.installments,
        "total_com_juros": "Total com juros: " + o.debtWithInterest.toFixed(2),
        "parcela_com_juros": "Parcela com juros: " + o.installmentWithInterest.toFixed(2),
        "obs": "Para número de parcelas acima de " + client.minInstallmentsFreeTax + ", será acrescido de " + interestRate*100 + "% ao mês!"
      }
      // alert(
      //   "Total: " + client.debt +
      //   "\nNúmero de Parcelas: " + o.nInstallment + 
      //   "\nParcela: " + o.installments +
      //   "\nTotal com juros: " + o.debtWithInterest.toFixed(2) +
      //   "\nParcela com juros: " + o.installmentWithInterest.toFixed(2) +
      //   "\n\nOBS: Para número de parcelas acima de " + client.minInstallmentsFreeTax + ", será acrescido de " + interestRate*100 + "% ao mês!"
      // )
      allInstallments.push(o.debtWithInterest.toFixed(2));
      sessionStorage.setItem('debtWithInterest', o.debtWithInterest.toFixed(2));
    }else{
      data = {
        "total": "Total: " + client.debt,
        "n_parcelas": "Número de Parcelas: " + o.nInstallment,
        "parcela": "Parcela: " + o.installments,
      }
      // alert(
      //   "Total: " + clientDebt +
      //   "\nNúmero de Parcelas: " + o.nInstallment + 
      //   "\nParcela: " + o.installments
      // )
      // document.getElementById("valor").innerHTML = data;
      allInstallments.push(o.installments.toFixed(2));
      sessionStorage.setItem('installments', o.installments.toFixed(2));
    }
  });
  result = {
    "simulados": "+ Valores simulados: ",
    "min_valor_devido": "Menor valor devido: " + client.debt,
    "max_valor_devido": "Maior valor devido: " + Math.max(...allInstallments)
  }
  all_data.push(data);
  results.push(result);
  console.log(data);
  sessionStorage.setItem('all_data', JSON.stringify(all_data));
  sessionStorage.setItem("results", JSON.stringify(results));
  showResults();
  // document.getElementById("valor").innerHTML = total;
}
