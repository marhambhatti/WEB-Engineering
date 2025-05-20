document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    let currentInput = '';
    let lastResult = null;
  
    const isOperator = (char) => ['+', '-', '*', '/', '%'].includes(char);
  
    function updateDisplay(value) {
      display.value = value;
    }
  
    function appendInput(value) {
      // Prevent multiple dots in a number
      if (value === '.' && currentInput.slice(-1) === '.') return;
      // Prevent starting with operator except minus
      if (isOperator(value) && currentInput === '') {
        if (value !== '-') return;
      }
      currentInput += value;
      updateDisplay(currentInput);
    }
  
    function clearAll() {
      currentInput = '';
      lastResult = null;
      updateDisplay('');
    }
  
    function backspace() {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput);
    }
  
    function calculateResult() {
      try {
        // Replace percentage expressed as a% to (a/100)
        let expression = currentInput.replace(/(\d+)%/g, '($1/100)');
        // Sanitize expression removing invalid characters (to allow only digits and operators)
        if (/[^0-9+\-*/().% ]/.test(expression)) {
          throw new Error('Invalid input!');
        }
        const result = Function(`"use strict";return (${expression})`)();
        if (result === undefined || isNaN(result)) {
          throw new Error('Invalid calculation');
        }
        lastResult = result;
        const displayResult = Number.isInteger(result) ? result : result.toFixed(8).replace(/\.?0+$/, '');
        updateDisplay(displayResult);
        currentInput = displayResult.toString();
      } catch (error) {
        updateDisplay('Error');
        currentInput = '';
        lastResult = null;
      }
    }
  
    function sqrt() {
      try {
        const value = eval(currentInput);
        if (value < 0) throw new Error('Invalid input');
        const result = Math.sqrt(value);
        const displayResult = Number.isInteger(result) ? result : result.toFixed(8).replace(/\.?0+$/, '');
        currentInput = displayResult.toString();
        updateDisplay(displayResult);
      } catch {
        updateDisplay('Error');
        currentInput = '';
      }
    }
  
    function square() {
      try {
        const value = eval(currentInput);
        const result = value * value;
        const displayResult = Number.isInteger(result) ? result : result.toFixed(8).replace(/\.?0+$/, '');
        currentInput = displayResult.toString();
        updateDisplay(displayResult);
      } catch {
        updateDisplay('Error');
        currentInput = '';
      }
    }
  
    function inverse() {
      try {
        const value = eval(currentInput);
        if (value === 0) throw new Error('Divide by zero');
        const result = 1 / value;
        const displayResult = Number.isInteger(result) ? result : result.toFixed(8).replace(/\.?0+$/, '');
        currentInput = displayResult.toString();
        updateDisplay(displayResult);
      } catch {
        updateDisplay('Error');
        currentInput = '';
      }
    }
  
    // Attach click event listeners
    const keys = document.querySelectorAll('.calculator-keys button');
    keys.forEach(key => {
      key.addEventListener('click', () => {
        const action = key.dataset.action;
  
        if (!isNaN(action) || action === '.') {
          appendInput(action);
          return;
        }
  
        switch (action) {
          case 'clear':
            clearAll();
            break;
          case 'backspace':
            backspace();
            break;
          case 'equals':
            calculateResult();
            break;
          case 'sqrt':
            sqrt();
            break;
          case 'square':
            square();
            break;
          case 'inverse':
            inverse();
            break;
          case 'percent':
            appendInput('%');
            break;
          case '+':
          case '-':
          case '*':
          case '/':
            // Prevent two operators in a row (replace last operator if exists)
            if (currentInput === '') {
              // Allow minus at start
              if (action === '-') {
                appendInput(action);
              }
              break;
            }
            if (isOperator(currentInput.slice(-1))) {
              currentInput = currentInput.slice(0, -1) + action;
            } else {
              appendInput(action);
            }
            updateDisplay(currentInput);
            break;
        }
      });
    });
  
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      const key = e.key;
  
      if ((key >= '0' && key <= '9') || key === '.') {
        appendInput(key);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculateResult();
      } else if (key === 'Backspace') {
        backspace();
      } else if (key === 'Escape') {
        clearAll();
      } else if (['+', '-', '*', '/'].includes(key)) {
        // Prevent two operators consecutively
        if (currentInput === '' && key !== '-') return;
        if (isOperator(currentInput.slice(-1))) {
          currentInput = currentInput.slice(0, -1) + key;
        } else {
          appendInput(key);
        }
        updateDisplay(currentInput);
      }
    });
  });
  