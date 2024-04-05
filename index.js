const input_display = document.querySelector(".display-value");
const numbers = document.querySelectorAll(".number");
const operations = document.querySelectorAll(".operation");
const equalEl = document.querySelector(".equal");
const clearAllEl = document.querySelector(".all-clear");
let result = "";
let operation = "";
let previousOPerand = 0;

let dis1Num = "";

let haveDot = false;

numbers.forEach((number) => {
  number.addEventListener("click", (e) => {
    if (
      e.target.innerText === "0" &&
      dis1Num.charAt(0) === "0" &&
      dis1Num.length === 1

    ) {
        console.log(dis1Num.length);
        console.log(dis1Num);
      return;
    }
    if (e.target.innerText === "." && !haveDot) {
      haveDot = true;
      // || isOperator1(dis1Num)
      if (!dis1Num || isOperator1(dis1Num)) {
        dis1Num += "0" + e.target.innerText;
        input_display.value = dis1Num;
        //1
        return;
      }
    } else if (e.target.innerText === "." && haveDot) {
      return;
    }
    dis1Num += e.target.innerText;
    input_display.value = dis1Num;

  });
});

operations.forEach((operation) => {
  operation.addEventListener("click", (e) => {
    if (
      (e.target.innerText === "+" ||
        e.target.innerText === "x" ||
        e.target.innerText === "/") &&
      dis1Num.length === 0
    ) {
      return;
    } else if (isOperator1(dis1Num)) {
      return;
    } else {

      dis1Num += e.target.innerText;
      input_display.value = dis1Num;
    }
    haveDot = false;
  });
});

function round(ansValue){
   let ansInString = ansValue.toString();

   if(ansInString.includes(".")){
        return Number(ansInString).toFixed(2);
   }
   else{
    return Number(ansInString);
   }
}
equalEl.addEventListener("click", (e) => {
  let ans = calculate(dis1Num);
    ans = round(ans);

  if(ans === Infinity) {
    dis1Num = '';
    input_display.value = 'INFINITY';
  }else if(ans === NaN) {
    dis1Num = '';
    input_display.value = 'NAN';

  }  else {
    dis1Num = ans;
    input_display.value = ans;
  }
});

clearAllEl.addEventListener("click", (e) => {
  dis1Num = "";
  haveDot = false;
  input_display.value = "";
});
function isOperator(char) {
  return ["+", "-", "x", "/"].includes(char);
}

function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "x" || op === "/") return 2;
  return 0;
}

function applyOp(op, b, a) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "x":
      return a * b;
    case "/":
      return a / b;
  }
}

function calculate(expression) {
  let numStack = [];
  let opStack = [];

  let num = "";
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    if (!isNaN(char) || char === ".") {
      num += char;
    } else if (isOperator(char)) {
      if (char === "-" && i === 0) {
        num += char;
      } else {
        numStack.push(parseFloat(num));
        num = "";

        while (
          opStack.length > 0 &&
          precedence(opStack[opStack.length - 1]) >= precedence(char)
        ) {
          numStack.push(applyOp(opStack.pop(), numStack.pop(), numStack.pop()));
        }
        opStack.push(char);
      }
    }
  }

  numStack.push(parseFloat(num));

  while (opStack.length > 0) {
    numStack.push(applyOp(opStack.pop(), numStack.pop(), numStack.pop()));
  }

  return numStack.pop();
}

function isOperator1(str) {
  let c = str.toString().charAt(str.length - 1);
  return ["+", "-", "x", "/"].includes(c);
}
