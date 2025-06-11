class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.history = document.createElement('div');
        this.history.id = 'history';
        this.display.parentNode.insertBefore(this.history, this.display.nextSibling);
        this.init();
    }

    init() {
        this.display.value = localStorage.getItem('calculatorDisplay') || '';
        this.addEventListeners();
        this.addKeyboardSupport();
    }

    addEventListeners() {
        document.querySelectorAll('.buttons button').forEach(button => {
            button.addEventListener('click', () => this.handleButtonClick(button.textContent));
        });
    }

    addKeyboardSupport() {
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            const validKeys = {
                '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
                '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
                '+': '+', '-': '-', '*': '*', '/': '/', '.': '.',
                'Enter': '=', 'Escape': 'C', 'Backspace': 'C'
            };
            if (validKeys[key]) {
                event.preventDefault();
                this.handleButtonClick(validKeys[key]);
            }
        });
    }

    handleButtonClick(value) {
        if (value === 'C') {
            this.clearDisplay();
        } else if (value === '=') {
            this.calculate();
        } else {
            this.appendToDisplay(value);
        }
    }

    appendToDisplay(value) {
        if (value === '.' && this.display.value.includes('.')) return;
        this.display.value += value;
        this.saveState();
    }

    clearDisplay() {
        this.display.value = '';
        this.saveState();
    }

    calculate() {
        let expression = this.display.value.trim();

        if (expression === '') {
            this.display.value = 'Error: Empty expression';
            return;
        }

        if (/[+\-*/]{2,}|[^0-9+\-*/.]/.test(expression)) {
            this.display.value = 'Error: Invalid expression';
            return;
        }

        try {
            let result = Function('"use strict";return (' + expression + ')')();
            if (isNaN(result) || !isFinite(result)) {
                this.display.value = 'Error: Invalid result';
            } else {
                const historyEntry = `${expression} = ${result}`;
                this.addToHistory(historyEntry);
                this.display.value = result;
                this.saveState();
            }
        } catch (error) {
            this.display.value = 'Error: Syntax error';
        }
    }

    addToHistory(entry) {
        const historyItem = document.createElement('p');
        historyItem.textContent = entry;
        this.history.appendChild(historyItem);
        this.history.scrollTop = this.history.scrollHeight; // Auto-scroll to latest
    }

    saveState() {
        localStorage.setItem('calculatorDisplay', this.display.value);
        localStorage.setItem('calculatorHistory', this.history.innerHTML);
    }
}

// Initialize calculator when the page loads
window.onload = () => {
    const calc = new Calculator();
    // Load history from localStorage
    calc.history.innerHTML = localStorage.getItem('calculatorHistory') || '';
};