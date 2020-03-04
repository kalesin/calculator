function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, a, b) {
    if (operator == "+") {
        return add(a, b)
    } else if (operator == "-") {
        return subtract(a, b)
    } else if (operator == "*") {
        return multiply(a, b)
    } else if (operator == "/") {
        return divide(a, b)
    }
}

function generateDigits() {
    for (let i = 9; i >= 0; i--) {
        var digit = document.createElement('div');
        digit.setAttribute('digit', `${i}`)
        digit.innerHTML = `${i}`;
        document.getElementById('numberButtons').appendChild(digit);
    }
    var digit = document.createElement('div');
    digit.setAttribute('digit', `.`)
    digit.innerHTML = `.`;
    document.getElementById('numberButtons').appendChild(digit);
}
generateDigits();

function generateFunctionButtons() {
    for (operator of ['+', '-', '*', '/', '=', 'c', '<-']) {
        var sign = document.createElement('div');
        sign.setAttribute('function', `${operator}`)
        sign.innerHTML = `${operator}`;
        document.getElementById('functionButtons').appendChild(sign);
    }
}
generateFunctionButtons();

function displaySetup() {
    for (let i = 0; i <= 2; i++) {
        var displayRow = document.createElement('div');
        displayRow.setAttribute('displayRow', `${i}`)
        document.getElementById('display').appendChild(displayRow);
    }
    if (document.querySelector(`[displayRow="0"]`)) {
        for (let i = 0; i <= 1; i++) {
            var displayColumn = document.createElement('div');
            displayColumn.setAttribute('displayColumn', `${i}`)
            document.querySelector(`[displayRow="0"]`).appendChild(displayColumn);
        }
    }
    if (document.querySelector(`[displayRow="2"]`)) {
        for (let i = 2; i <= 3; i++) {
            var displayColumn = document.createElement('div');
            displayColumn.setAttribute('displayColumn', `${i}`)
            document.querySelector(`[displayRow="2"]`).appendChild(displayColumn);
        }
    }
}
displaySetup();

let last10pressed = [];
let firstInput = null;
let secondInput = null;
let lastOperatorPressed = null;
let previousOperatorPressed = null;
let result = null;
let resultDigits = null;

function displayOverflowingDigits(digitArray){
    if (digitArray.filter(element => element == "e") > 0) {
        let factorE = digitArray.splice(digitArray.indexOf("e"), digitArray.length);
        digitArray.splice(9, digitArray.length)
        digitArray.splice(1, 0, ".")
        document.querySelector(`[displayColumn="2"]`).innerHTML = digitArray.join("");
        document.querySelector(`[displayColumn="3"]`).innerHTML = factorE;
    } else if (digitArray.filter(element => element == "e") == 0) {
        let powerOf10 = digitArray.splice(9, digitArray.length)
        digitArray.splice(1, 0, ".")
        document.querySelector(`[displayColumn="2"]`).innerHTML = digitArray.join("");
        document.querySelector(`[displayColumn="3"]`).innerHTML = `* 10^${powerOf10.length+9}`;
    }
}

function displayPressed() {
    document.getElementById('buttons').addEventListener('click', (event) => {
        const pressedButton = event.target.attributes[0]
        if (pressedButton.localName == 'digit' && !firstInput) {
            for (let i = 0; i <= 1; i++) {
                document.querySelector(`[displayColumn="${i}"]`).innerHTML = "";
            }
            document.querySelector(`[displayRow="1"]`).innerHTML = "";
            if (last10pressed.filter(element => element == ".").length > 0) {
                document.querySelector(`[digit="."]`).style["background-color"] = "#5f5f5f";
                if (pressedButton.value !== ".") {
                    if (last10pressed.length < 10) {
                        last10pressed.push(pressedButton.value);
                    } else {
                        last10pressed.shift();
                        last10pressed.push(pressedButton.value);
                    }
                }
            } else {
                document.querySelector(`[digit="."]`).style["background-color"] = "gray";
                if (last10pressed.length < 10) {
                    last10pressed.push(pressedButton.value);
                } else {
                    last10pressed.shift();
                    last10pressed.push(pressedButton.value);
                }
            }
            document.querySelector(`[displayColumn="0"]`).innerHTML = last10pressed.join('')
        } else if (pressedButton.localName == 'digit' && firstInput) {
            if (last10pressed.filter(element => element == ".").length > 0) {
                document.querySelector(`[digit="."]`).style["background-color"] = "#5f5f5f";
                if (pressedButton.value !== ".") {
                    if (last10pressed.length < 10) {
                        last10pressed.push(pressedButton.value);
                    } else {
                        last10pressed.shift();
                        last10pressed.push(pressedButton.value);
                    }
                }
            } else {
                document.querySelector(`[digit="."]`).style["background-color"] = "gray";
                if (last10pressed.length < 10) {
                    last10pressed.push(pressedButton.value);
                } else {
                    last10pressed.shift();
                    last10pressed.push(pressedButton.value);
                }
            }
            document.querySelector(`[displayColumn="0"]`).innerHTML = last10pressed.join('')
            secondInput = last10pressed.join('');
        } else if (pressedButton.localName == 'function') {
            //backwards button
            if (pressedButton.value == '<-' && last10pressed.length > 0 && !secondInput) {
                last10pressed.pop();
                document.querySelector(`[displayColumn="0"]`).innerHTML = last10pressed.join("");
            } else if (pressedButton.value == '<-' && last10pressed.length > 0 && secondInput) {
                last10pressed.pop();
                secondInput = last10pressed.join('')
                document.querySelector(`[displayColumn="0"]`).innerHTML = last10pressed.join('');
            }
            document.querySelector(`[digit="."]`).style["background-color"] = "gray";
            lastOperatorPressed = pressedButton.value;
            var operators = ['+', '-', '*', '/'];
            if (operators.indexOf(lastOperatorPressed) >= 0 && !firstInput) {
                firstInput = last10pressed.join('');
                document.querySelector(`[displayRow="1"]`).innerHTML = firstInput;
                last10pressed = [];
                document.querySelector(`[displayColumn="0"]`).innerHTML = last10pressed.join('')
                document.querySelector(`[displayColumn="1"]`).innerHTML = lastOperatorPressed;
                previousOperatorPressed = lastOperatorPressed;
            } else if (operators.indexOf(lastOperatorPressed) >= 0 && firstInput && !secondInput) {
                document.querySelector(`[displayColumn="1"]`).innerHTML = lastOperatorPressed;
            } else if (operators.indexOf(lastOperatorPressed) >= 0 && firstInput && secondInput) {
                document.querySelector(`[digit="."]`).style["background-color"] = "gray";
                let firstInputNum = parseFloat(firstInput, 10);
                let secondInputNum = parseFloat(secondInput, 10);
                if (lastOperatorPressed == "/" && secondInput == 0) {
                    document.querySelector(`[displayColumn="0"]`).innerHTML = "Can't divide by 0!"
                } else {
                    result = operate(previousOperatorPressed, firstInputNum, secondInputNum);
                    resultDigits = result.toString().split("");
                    if (resultDigits.length >= 10) {
                        displayOverflowingDigits(resultDigits);
                    } else {
                        document.querySelector(`[displayRow="1"]`).innerHTML = resultDigits.join("");
                    }
                }
                document.querySelector(`[displayColumn="1"]`).innerHTML = lastOperatorPressed;
                document.querySelector(`[displayColumn="0"]`).innerHTML = null;
                firstInput = resultDigits.join("");
                secondInput = null;
                previousOperatorPressed = lastOperatorPressed;
                lastOperatorPressed = null;
                last10pressed = [];
            } else if (lastOperatorPressed == "=" && firstInput && secondInput) {
                document.querySelector(`[digit="."]`).style["background-color"] = "gray";
                let firstInputNum = parseFloat(firstInput, 10);
                let secondInputNum = parseFloat(secondInput, 10);
                if (!result) {
                    if (previousOperatorPressed == "/" && secondInput == 0) {
                        document.querySelector(`[displayColumn="2"]`).innerHTML = "Can't divide by 0!"
                    } else {
                        result = operate(previousOperatorPressed, firstInputNum, secondInputNum);
                        resultDigits = result.toString().split("");
                        console.log('resultDigits')
                        console.log(resultDigits)dd
                        console.log(result)
                        if (resultDigits.length >= 10) {
                            displayOverflowingDigits(resultDigits);
                        } else {
                            document.querySelector(`[displayColumn="2"]`).innerHTML = resultDigits.join("");
                        }
                    }
                    last10pressed = [];
                } else if (result) {
                    firstInput = resultDigits.join("");
                    firstInputNum = parseFloat(firstInput, 10);
                    if (previousOperatorPressed == "/" && secondInput == 0) {
                        document.querySelector(`[displayColumn="2"]`).innerHTML = "Can't divide by 0!"
                    } else {
                        result = operate(previousOperatorPressed, firstInputNum, secondInputNum);
                        resultDigits = result.toString().split("");
                        console.log('resultDigits')
                        console.log(resultDigits)
                        console.log(result)
                        if (resultDigits.length >= 10) {
                            displayOverflowingDigits(resultDigits);
                        } else {
                            document.querySelector(`[displayColumn="2"]`).innerHTML = resultDigits.join("");
                        }
                    }
                    last10pressed = [];
                }
            } else if (lastOperatorPressed == "c") {
                for (let i = 0; i <= 3; i++) {
                    document.querySelector(`[displayColumn="${i}"]`).innerHTML = "";
                }
                for (let i = 1; i <= 2; i++) {
                    document.querySelector(`[displayRow="${i}"]`).innerHTML = "";
                }
                firstInput = null;
                secondInput = null;
                lastOperatorPressed = null;
                previousOperatorPressed = null;
                result = null;
                last10pressed = [];
            }
        }
        /* console.log('last10pressed')
        console.log(last10pressed.join(''))
        console.log('lastOperator')
        console.log(lastOperatorPressed)
        console.log('previousOperator')
        console.log(previousOperatorPressed)
        console.log('firstInput')
        console.log(firstInput)
        console.log('secondInput')
        console.log(secondInput)
        console.log('result')
        console.log(resultDigits.join("")) */
    })
}
displayPressed();