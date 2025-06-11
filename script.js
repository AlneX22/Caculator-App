class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.init();
    }

    init() {
        // Load previous calculation from localStorage
        this.display.value = localStorage.getItem('calculatorDisplay') || '';
        this.addEventListeners();
    }

    addEventListeners() {
        document.querySelectorAll('.buttons button').forEach(button => {
            button.addEventListener('click', () => this.handleButtonClick(button.textContent));
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
        // Prevent multiple decimal points in a number
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
            this.display.value = 'Error';
            return;
        }

        if (/[+\-*/]{2,}|[^0-9+\-*/.]/.test(expression)) {
            this.display.value = 'Error';
            return;
        }

        try {
            let result = Function('"use strict";return (' + expression + ')')(); // Safer eval alternative
            if (isNaN(result) || !isFinite(result)) {
                this.display.value = 'Error';
            } else {
                this.display.value = result;
                this.saveState();
            }
        } catch (error) {
            this.display.value = 'Syntax error';
        }
    }

    saveState() {
        localStorage.setItem('calculatorDisplay', this.display.value);
    }
}

// Initialize calculator when the page loads
window.onload = () => new Calculator();