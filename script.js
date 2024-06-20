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
                    this.transitionFunction[transitionKey].forEach(nextState => nextStates.add(nextState));
                }
            }
            currentStates = nextStates;
        }
        return [...currentStates].some(state => this.acceptStates.has(state));
    }

    // Add methods for converting NFA to DFA and minimizing DFA if needed
}

const faForm = document.getElementById('faForm');
const testStringForm = document.getElementById('testStringForm');
let currentFA = null;

faForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const states = document.getElementById('states').value.split(',').map(s => s.trim());
    const alphabet = document.getElementById('alphabet').value.split(',').map(s => s.trim());
    const transitions = document.getElementById('transitions').value.split(';').map(t => t.trim());
    const startState = document.getElementById('startState').value.trim();
    const acceptStates = document.getElementById('acceptStates').value.split(',').map(s => s.trim());

    const transitionFunction = {};
    transitions.forEach(transition => {
        const [input, output] = transition.split('->').map(t => t.trim());
        const [state, symbol] = input.split(',').map(t => t.trim());
        const key = `${state},${symbol}`;
        if (!transitionFunction[key]) {
            transitionFunction[key] = [];
        }
        transitionFunction[key].push(output);
    });

    currentFA = new FiniteAutomaton(states, alphabet, transitionFunction, startState, acceptStates);
    displayFADetails(currentFA);
});

testStringForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const testString = document.getElementById('testString').value.trim();
    if (currentFA) {
        const result = currentFA.acceptsString(testString);
        document.getElementById('testResult').innerText = result ? 'Accepted' : 'Rejected';
    } else {
        document.getElementById('testResult').innerText = 'Please create a finite automaton first.';
    }
});

function displayFADetails(fa) {
    const faDetails = document.getElementById('faDetails');
    faDetails.innerHTML = `
        <p><strong>States:</strong> ${[...fa.states].join(', ')}</p>
        <p><strong>Alphabet:</strong> ${[...fa.alphabet].join(', ')}</p>
        <p><strong>Transition Function:</strong></p>
        <ul>
            ${Object.entries(fa.transitionFunction).map(([key, value]) => `<li>${key} -> ${value.join(', ')}</li>`).join('')}
        </ul>
        <p><strong>Start State:</strong> ${fa.startState}</p>
        <p><strong>Accept States:</strong> ${[...fa.acceptStates].join(', ')}</p>
        <p><strong>Deterministic:</strong> ${fa.isDeterministic() ? 'Yes' : 'No'}</p>
    `;
}


