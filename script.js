const buttons = [
  { key: "clear", label: "AC", type: "action" },
  { key: "brackets", label: "( )", type: "action" },
  { key: "%", label: "%", type: "action" },
  { key: "/", label: "÷", type: "operator" },
  { key: "7", label: "7", type: "" },
  { key: "8", label: "8", type: "" },
  { key: "9", label: "9", type: "" },
  { key: "*", label: "X", type: "operator" },
  { key: "4", label: "4", type: "" },
  { key: "5", label: "5", type: "" },
  { key: "6", label: "6", type: "" },
  { key: "-", label: "-", type: "operator" },
  { key: "1", label: "1", type: "" },
  { key: "2", label: "2", type: "" },
  { key: "3", label: "3", type: "" },
  { key: "+", label: "+", type: "operator" },
  { key: "backspace", label: "<", type: "action" },
  { key: "0", label: "0", type: "" },
  { key: ".", label: ".", type: "" },
  { key: "=", label: "=", type: "operator" },
];

const keysContainer = document.querySelector("#keys-container");

function renderButtons() {
  keysContainer.innerHTML = buttons
    .map(
      (btn) => `
    <div data-key="${btn.key}" class="key ${btn.type}">
      <span>${btn.label}</span>
    </div>
    `,
    )
    .join("");
}

renderButtons();

const keys = document.querySelectorAll(".key");
const display_input = document.querySelector(".display .input");
const display_output = document.querySelector(".display .output");

let justCalculated = false;
let input = "";

for (let key of keys) {
  const value = key.dataset.key;

  key.addEventListener("click", () => {
    if (value == "clear") {
      input = "";
      display_input.innerHTML = "";
      display_output.innerHTML = "";
    } else if (value == "backspace") {
      input = input.slice(0, -1);
      display_input.innerHTML = cleanInput(input);
    } else if (value == "=") {
      try {
        let result = eval(prepareInput(input));
        result = parseFloat(result.toFixed(18));
        input = result.toString();
        display_output.innerHTML = cleanOutput(result);
        justCalculated = true;
      } catch {
        display_output.innerHTML = "Error";
      }
    } else if (value == "brackets") {
      if (
        input.indexOf("(") == -1 ||
        (input.indexOf("(") != -1 &&
          input.indexOf(")") != -1 &&
          input.lastIndexOf(")") > input.lastIndexOf("("))
      ) {
        input += "(";
      } else if (
        (input.indexOf("(") != -1 &&
          input.indexOf(")") != -1 &&
          input.lastIndexOf("(") > input.lastIndexOf(")")) ||
        input.indexOf(")") == -1
      ) {
        input += ")";
      }
      display_input.innerHTML = cleanInput(input);
    } else {
      if (validateInput(value)) {
        if (justCalculated && !isOperator(value)) {
          input = value;
          display_output.innerHTML = "";
        } else if (justCalculated && isOperator(value)) {
          input += value;
        } else {
          input += value;
        }

        justCalculated = false;
        display_input.innerHTML = cleanInput(input);
      }
    }
  });
}

function cleanInput(input) {
  const operators = {
    "*": ' <span class="operator">x</span> ',
    "/": ' <span class="operator">÷</span> ',
    "+": ' <span class="operator">+</span> ',
    "-": ' <span class="operator">-</span> ',
    ")": '<span class="brackets">)</span>',
    "(": '<span class="brackets">(</span>',
    "%": '<span class="percent">%</span>',
  };

  return input
    .split("")
    .map((char) => operators[char] || char)
    .join("");
}
function cleanOutput(output) {
  let [integer, decimal] = output.toString().split(".");

  integer = Number(integer).toLocaleString("en-US");

  return decimal ? `${integer}.${decimal}` : integer;
}

function validateInput(value) {
  let last_input = input.slice(-1);
  let operators = ["*", "/", "+", "-"];

  if (value === ".") {
    let number = input.split(/[\+\-\*\/]/).pop();
    if (number.includes(".")) {
      return false;
    }
  }
  if (operators.includes(value)) {
    if (operators.includes(last_input)) {
      return false;
    } else {
      return true;
    }
  }
  return true;
}

function prepareInput(input) {
  let input_array = input.split("");
  for (let i = 0; i < input_array.length; i++) {
    if (input_array[i] == "%") {
      input_array[i] = "/100";
    }
  }
  return input_array.join("");
}
function isOperator(value) {
  return ["*", "/", "+", "-"].includes(value);
}
