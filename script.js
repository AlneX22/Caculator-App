function appendToDisplay(value) {
    const display = document.getElementById('display');
    // Prevent multiple decimal points in a number
    if (value === '.' && display.value.includes('.')) return;
    display.value += value;
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function calculate() {
    const display = document.getElementById('display');
    let expression = display.value.trim();

    if (expression === '') {
        display.value = 'Error';
        return;
    }

    // Check for consecutive operators or invalid characters
    if (/[+\-*/]{2,}|[^0-9+\-*/.]/.test(expression)) {
        display.value = 'Error';
        return;
    }

    try {
        // Evaluate the expression
        let result = eval(expression);
        // Check for NaN or Infinity
        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Error';
        } else {
            display.value = result;
        }
    } catch (error) {
        display.value = 'Syntax error';
    }
}