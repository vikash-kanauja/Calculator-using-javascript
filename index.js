const input_display = document.querySelector(".display-value");
const numbers = document.querySelectorAll(".number");
const operations = document.querySelectorAll(".operation");
const equalButton = document.querySelector(".equal");
const clearAllButton = document.querySelector(".all-clear");

let display_number = ""; // Holds the current input/displayed number

let haveDot = false; // Tracks whether a decimal point is already present in the number

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
      if (!display_number || checkIsLastOperator(display_number)) {
        // Adding "0" before the decimal if it's the first input or after an operator
        display_number += "0" + e.target.innerText;
        input_display.value = display_number;
        return;
      }
    } else if (e.target.innerText === "." && haveDot) {
      return;
    }

    display_number += e.target.innerText; // Appending the input number to the display
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
    } else if (
      (display_number.charAt(display_number.length - 1) === "x" ||
        display_number.charAt(display_number.length - 1) === "/") &&
      e.target.innerText === "-" &&
      display_number.length >= 2
    ) {
      display_number += e.target.innerText;
      input_display.value = display_number;
    } else if (checkIsLastOperator(display_number)) {
      return;
    } else if (display_number.charAt(display_number.length - 1) === ".") {
      // Handling the case when "." is the last character
      return display_number;
    } else {
      display_number += e.target.innerText;
      input_display.value = display_number;
    }
    haveDot = false;
  });
});

// Function to round the result to 2 decimal places

function roundOffNumber(resultValue) {
  let resultInString = resultValue.toString();

  if (resultInString.includes(".")) {
    return Number(resultInString).toFixed(2);
  } else {
    return Number(resultInString);
  }
}

// Click handler for the equal button

equalButton.addEventListener("click", (e) => {
  if (checkIsLastOperator(display_number.charAt(display_number.length - 1))) {
    return display_number;
  }

  // Calculate the result

  let result = calculate(display_number);
  display_number += "" + result;
  result = roundOffNumber(result);

  if (result === Infinity) {
    display_number = "";
    input_display.value = "INFINITY";
  } else {
    display_number = "" + result;
    input_display.value = display_number;
  }
});

// Click handler for the clear button

clearAllButton.addEventListener("click", (e) => {
  display_number = "";
  haveDot = false;
  input_display.value = "";
});

// Function to check if a character is an operator

function checkIsOperator(char) {
  return ["+", "-", "x", "/"].includes(char);
}
// Function to determine operator precedence

function precedence(oper) {
  if (oper === "+" || oper === "-") return 1;
  if (oper === "x" || oper === "/") return 2;
  return 0;
}

// Function to apply the operation to two operands

function applyOperation(oper, b, a) {
  // Handling negative value calculation

  if (oper === "x") {
    if (a < 0 && b < 0) {
      return Math.abs(a) * Math.abs(b);
    } else if( a< 0 || b<0){
      return -Math.abs(a) * Math.abs(b);
    }
  } else if (oper === "/") {
    if (b < 0 && a < 0) {
      return Math.abs(a) / Math.abs(b);
    } else if (a < 0 && b > 0) {
      return -Math.abs(a) / b;
    } else if (b < 0 && a >0) {
      return Math.abs(a) / -Math.abs(b);
    }
  }

  switch (oper) {
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
  let numberStack = [];
  let operatorStack = [];
  let num = "";
  let unaryMinus = false; // Flag to track unary minus

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === "-" && (i === 0 || checkIsOperator(expression[i - 1]))) {
      unaryMinus = true; // Set flag for unary minus
    } else if (!isNaN(char) || char === ".") {
      num += char;
    } else if (checkIsOperator(char)) {
      if (unaryMinus) {
        num = "-" + num; // Apply unary minus to the current number
        unaryMinus = false; // Reset flag
      }

      numberStack.push(parseFloat(num));
      num = "";

      while (
        operatorStack.length > 0 &&
        precedence(operatorStack[operatorStack.length - 1]) >= precedence(char)
      ) {
        numberStack.push(applyOperation(operatorStack.pop(), numberStack.pop(), numberStack.pop()));
      }
      operatorStack.push(char);
    }
  }

  if (unaryMinus) {
    num = "-" + num; // Apply unary minus to the last number if present
  }

  numberStack.push(parseFloat(num));

  while (operatorStack.length > 0) {
    numberStack.push(applyOperation(operatorStack.pop(), numberStack.pop(), numberStack.pop()));
  }

  return numberStack.pop();
}
// Function to check if last  character is an operator
function checkIsLastOperator(str) {
  let c = str.toString().charAt(str.length - 1);
  return ["+", "-", "x", "/"].includes(c);
}
