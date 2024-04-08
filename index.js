const inputDisplay = document.querySelector(".display-value");
const numbers = document.querySelectorAll(".number");
const operations = document.querySelectorAll(".operation");
const equalButton = document.querySelector(".equal");
const clearAllButton = document.querySelector(".all-clear");

let displayNumber = ""; // Holds the current input/displayed number

let isDecimalPoint = false; // Tracks whether a decimal point is already present in the number

// adding click handlers to number buttons
numbers.forEach((number) => {
  number.addEventListener("click", (e) => {
    if (
      e.target.innerText === "0" &&
      displayNumber.charAt(0) === "0" &&
      displayNumber.length === 1
    ) {
      return;
    }
    // Handling decimal input
    if (e.target.innerText === "." && !isDecimalPoint) {
      isDecimalPoint = true;
      if (!displayNumber || checkIsLastOperator(displayNumber)) {
        // Adding "0" before the decimal if it's the first input or after an operator
        displayNumber += "0" + e.target.innerText;
        inputDisplay.value = displayNumber;
        return;
      }
    } else if (e.target.innerText === "." && isDecimalPoint) {
      return;
    }

    displayNumber += e.target.innerText; // Appending the input number to the display
    inputDisplay.value = displayNumber;
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
      displayNumber.length === 0
    ) {
      return;
    } else if (
      (displayNumber.charAt(displayNumber.length - 1) === "x" ||
        displayNumber.charAt(displayNumber.length - 1) === "/") &&
      e.target.innerText === "-" &&
      displayNumber.length >= 2
    ) {
      displayNumber += e.target.innerText;
      inputDisplay.value = displayNumber;
    } else if (checkIsLastOperator(displayNumber)) {
      return;
    } else if (displayNumber.charAt(displayNumber.length - 1) === ".") {
      // Handling the case when "." is the last character
      return displayNumber;
    } else {
      displayNumber += e.target.innerText;
      inputDisplay.value = displayNumber;
    }
    isDecimalPoint = false;
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
  if (checkIsLastOperator(displayNumber.charAt(displayNumber.length - 1))) {
    return displayNumber;
  }

  // Calculate the result

  let result = calculate(inputDisplay.value);
  console.log(result);
  displayNumber += "" + result;
  result = roundOffNumber(result);

  if (result === Infinity) {
    displayNumber = "";
    inputDisplay.value = "INFINITY";
  } else {
    displayNumber = "" + result;
    inputDisplay.value = displayNumber;
  }
});

// Click handler for the clear button

clearAllButton.addEventListener("click", (e) => {
  displayNumber = "";
  isDecimalPoint = false;
  inputDisplay.value = "";
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
