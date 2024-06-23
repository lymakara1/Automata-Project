// nav bar script
document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector("[data-collapse-toggle]");
  const menu = document.querySelector("#navbar-default");

  button.addEventListener("click", function () {
    menu.classList.toggle("hidden");
  });

  const links = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const target = link.getAttribute("data-target");

      pages.forEach((page) => {
        if (page.id === target) {
          page.classList.remove("hidden");
        } else {
          page.classList.add("hidden");
        }
      });
    });
  });
});

//  document page script
const questions = [
  "How do I input the value of a State?",
  "How do I input the value of the Alphabet?",
  "How can I define the Transition Function?",
  "How do I start the State Transition?",
  "what can I do with the Accept Start?",
  "Sumit form to Create a Automation",
  "Testing a String -> Ensure Automaton is Defined",
  "Testing a String -> Input String",
  "Testing a String -> Submit for Testing",
  // Add more questions here if needed
];

const answers = [
  "Enter all the states of your automaton, separated by commas. For example: q0, q1, q2.",
  `Enter the alphabet symbols separated by commas. For example: a, b.`,
  `Define the transitions in the format state,symbol->nextState, and separate multiple transitions with semicolons. For example: q0,a->q1; q1,b->q2.`,
  `Enter the start state of your automaton. For example: q0.`,
  `Enter the accept states, separated by commas. For example: q2.`,
  `The program will display the details of the defined automaton and indicate whether it is deterministic (DFA) or non-deterministic (NFA).`,
  `Make sure you have defined the automaton using the steps above.`,
  `Enter the string you want to test in the input field labeled "Input String".`,
  `Submit the form to test the string.`,

  // Add corresponding answers here
];

const questionsContainer = document.getElementById("questionsContainer");

questions.forEach((question, index) => {
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("question");

  const questionInnerDiv = document.createElement("div");
  questionInnerDiv.classList.add(
    "question",
    "flex",
    "justify-between",
    "items-center",
    "w-full",
    "max-w-[800px]",
    "h-[50px]",
    "rounded-[25px]",
    "pl-4",
    "pr-6",
    "mt-2",
    "border",
    "shadow-lg",
    "cursor-pointer"
  );

  const questionText = document.createElement("span");
  questionText.textContent = `${index + 1}. ${question}`;

  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgIcon.setAttribute("viewBox", "0 0 512 512");
  svgIcon.classList.add("w-6", "h-6"); // Added Tailwind classes for sizing
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "#70C0FC");
  path.setAttribute(
    "d",
    "M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
  );
  svgIcon.appendChild(path);

  questionInnerDiv.appendChild(questionText);
  questionInnerDiv.appendChild(svgIcon);
  questionDiv.appendChild(questionInnerDiv);

  const answerDiv = document.createElement("div");
  answerDiv.classList.add("answer", "hidden", "mt-[10px]");
  answerDiv.innerHTML = `<p>${answers[index]}</p>`;

  questionDiv.appendChild(answerDiv);

  questionDiv.addEventListener("click", () => {
    if (answerDiv.classList.contains("hidden")) {
      answerDiv.classList.remove("hidden");
      svgIcon.classList.add("rotate-180");
    } else {
      answerDiv.classList.add("hidden");
      svgIcon.classList.remove("rotate-180");
    }
  });

  questionsContainer.appendChild(questionDiv);
});

// technical page
class FiniteAutomaton {
  constructor(states, alphabet, transitionFunction, startState, acceptStates) {
    this.states = new Set(states);
    this.alphabet = new Set(alphabet);
    this.transitionFunction = transitionFunction;
    this.startState = startState;
    this.acceptStates = new Set(acceptStates);
  }

  isDeterministic() {
    for (const [key, value] of Object.entries(this.transitionFunction)) {
      if (value.length > 1) {
        return false;
      }
    }
    return true;
  }

  acceptsString(string) {
    let currentStates = new Set([this.startState]);
    for (const symbol of string) {
      const nextStates = new Set();
      for (const state of currentStates) {
        const transitionKey = `${state},${symbol}`;
        if (this.transitionFunction[transitionKey]) {
          this.transitionFunction[transitionKey].forEach((nextState) =>
            nextStates.add(nextState)
          );
        }
      }
      currentStates = nextStates;
    }
    return [...currentStates].some((state) => this.acceptStates.has(state));
  }

  // Add methods for converting NFA to DFA and minimizing DFA if needed
}

const faForm = document.getElementById("faForm");
const testStringForm = document.getElementById("testStringForm");
let currentFA = null;

faForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const states = document
    .getElementById("states")
    .value.split(",")
    .map((s) => s.trim());
  const alphabet = document
    .getElementById("alphabet")
    .value.split(",")
    .map((s) => s.trim());
  const transitions = document
    .getElementById("transitions")
    .value.split(";")
    .map((t) => t.trim());
  const startState = document.getElementById("startState").value.trim();
  const acceptStates = document
    .getElementById("acceptStates")
    .value.split(",")
    .map((s) => s.trim());

  const transitionFunction = {};
  transitions.forEach((transition) => {
    const [input, output] = transition.split("->").map((t) => t.trim());
    const [state, symbol] = input.split(",").map((t) => t.trim());
    const key = `${state},${symbol}`;
    if (!transitionFunction[key]) {
      transitionFunction[key] = [];
    }
    transitionFunction[key].push(output);
  });

  currentFA = new FiniteAutomaton(
    states,
    alphabet,
    transitionFunction,
    startState,
    acceptStates
  );
  displayFADetails(currentFA);
});

testStringForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const testString = document.getElementById("testString").value.trim();
  if (currentFA) {
    const result = currentFA.acceptsString(testString);
    document.getElementById("testResult").innerText = result
      ? "Accepted"
      : "Rejected";
  } else {
    document.getElementById("testResult").innerText =
      "Please create a finite automaton first.";
  }
});

function displayFADetails(fa) {
  const faDetails = document.getElementById("faDetails");
  faDetails.innerHTML = `
        <p><strong>States:</strong> ${[...fa.states].join(", ")}</p>
        <p><strong>Alphabet:</strong> ${[...fa.alphabet].join(", ")}</p>
        <p><strong>Transition Function:</strong></p>
        <ul>
            ${Object.entries(fa.transitionFunction)
              .map(([key, value]) => `<li>${key} -> ${value.join(", ")}</li>`)
              .join("")}
        </ul>
        <p><strong>Start State:</strong> ${fa.startState}</p>
        <p><strong>Accept States:</strong> ${[...fa.acceptStates].join(
          ", "
        )}</p>
        <p><strong>Deterministic:</strong> ${
          fa.isDeterministic() ? "Yes" : "No"
        }</p>
    `;
}
