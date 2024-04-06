const input_display = document.querySelector(".display-value");
const numbers = document.querySelectorAll(".number");
const operations = document.querySelectorAll(".operation");
const equalEl = document.querySelector(".equal");
const clearAllEl = document.querySelector(".all-clear");

let display_number = "";   // Holds the current input/displayed number

let haveDot = false;// Tracks whether a decimal point is already present in the number

// adding click handlers to number buttons
numbers.forEach((number) => {
  number.addEventListener("click", (e) => {
    if (
      e.target.innerText === "0" &&
      display_number.charAt(0) === "0" &&
      display_number.length === 1

    ) {

      return;
    }
    // Handling decimal input
    if (e.target.innerText === "." && !haveDot) {
      haveDot = true;
      if (!display_number || isLastOperator(display_number)) {
        // Adding "0" before the decimal if it's the first input or after an operator
        display_number += "0" + e.target.innerText;
        input_display.value = display_number;
        return;
      }
    } else if (e.target.innerText === "." && haveDot) {
      return;
    }

    display_number += e.target.innerText;   // Appending the input number to the display
    input_display.value = display_number;

  });
});


// adding click handlers to number buttons
operations.forEach((operation) => {
  operation.addEventListener("click", (e) => {
    // if first key pressed is an opearator, don't do anything 
    if (
      (e.target.innerText === "+" ||
        e.target.innerText === "x" ||
        e.target.innerText === "/") &&
        display_number.length === 0
    ) {
      return;
    } else if (isLastOperator(display_number)) {
      return;
    }
    else if(display_number.charAt(display_number.length -1) ==="."){    // Handling the case when "." is the last character
      return display_number;
    }
    else {

      display_number += e.target.innerText;
      input_display.value = display_number;
    }
    haveDot = false;
  });
});

// Function to round the result to 2 decimal places

function round(ansValue){
   let ansInString = ansValue.toString();

   if(ansInString.includes(".")){
        return Number(ansInString).toFixed(2);
   }
   else{
    return Number(ansInString);
   }
}

// Click handler for the equal button

equalEl.addEventListener("click", (e) => {

  if( isLastOperator(display_number.charAt(display_number.length - 1))){
    return display_number;
  } 

  // Calculate the result

  let ans = calculate(display_number);
  display_number += "" + ans;
    ans = round(ans);

  if(ans === Infinity) {
    display_number = '';
    input_display.value = 'INFINITY';
  }

    else {
      display_number = "" + ans;
    input_display.value = display_number;
  }
});

// Click handler for the clear button


clearAllEl.addEventListener("click", (e) => {
  display_number = "";
  haveDot = false;
  input_display.value = "";
});

// Function to check if a character is an operator


function isOperator(char) {
  return ["+", "-", "x", "/"].includes(char);
}
// Function to determine operator precedence

function precedence(op) {
  if (op === "+" || op === "-") return 1;
  if (op === "x" || op === "/") return 2;
  return 0;
}

// Function to apply the operation to two operands

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

// Function to perform the calculation
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
// Function to check if last  character is an operator
function isLastOperator(str) {
  let c = str.toString().charAt(str.length - 1);
  return ["+", "-", "x", "/"].includes(c);
}
