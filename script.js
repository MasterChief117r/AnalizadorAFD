let automaton = {
    states: [],
    alphabet: [],
    initialState: null,
    finalStates: [],
    transitions: {}
};

document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        parseAutomaton(e.target.result);
    };
    reader.readAsText(file);
});

function parseAutomaton(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    // Extrae estados, alfabeto, estado inicial, estados finales, y transiciones
    automaton.alphabet = Array.from(xmlDoc.getElementsByTagName("ALFABETO")[0].children).map(node => node.textContent);
    automaton.states = Array.from(xmlDoc.getElementsByTagName("ESTADO")[0].children).map(node => parseInt(node.textContent));
    automaton.initialState = parseInt(xmlDoc.getElementsByTagName("INICIAL")[0].textContent);
    automaton.finalStates = Array.from(xmlDoc.getElementsByTagName("FINAL")[0].children).map(node => parseInt(node.textContent));
    
    automaton.transitions = {};
    Array.from(xmlDoc.getElementsByTagName("TRANSICIONES")[0].children).forEach(node => {
        const [origin, symbol, destination] = node.textContent.split(",");
        if (!automaton.transitions[origin]) automaton.transitions[origin] = {};
        if (automaton.transitions[origin][symbol]) {
            console.error(`Error: Doble transición para el símbolo '${symbol}' desde el estado ${origin}`);
        }
        automaton.transitions[origin][symbol] = parseInt(destination);
    });
}

function analyzeString() {
    const inputString = document.getElementById("inputString").value;
    let currentState = automaton.initialState;
    let trace = `Tracabilidad: ${currentState}`;

    for (let char of inputString) {
        if (!automaton.alphabet.includes(char)) {
            document.getElementById("result").innerText = `Error: Símbolo '${char}' no reconocido`;
            return;
        }
        currentState = automaton.transitions[currentState]?.[char];
        if (currentState === undefined) {
            document.getElementById("result").innerText = "Cadena no aceptada";
            return;
        }
        trace += ` -> ${currentState}`;
    }
    const result = automaton.finalStates.includes(currentState) ? "Cadena aceptada" : "Cadena no aceptada";
    document.getElementById("result").innerText = `${trace}\nResultado: ${result}`;
}
