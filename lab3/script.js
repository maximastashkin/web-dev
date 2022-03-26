// noinspection JSSuspiciousNameCombination

function calculateFirstFunc(x, y, nm1) {
    let result = y / (x + 1);
    let p = 1;
    let xPower = 1;
    for (let n = 1; n <= nm1; n++) {
        p *= (y + (xPower * x) / y / n);
    }
    return result * p;
}

function calculateSecondFunc(y, nm2) {
    let s = 0;
    let yPower = 1;
    for (let n = 0; n <= nm2; n++) {
        s += ((yPower * y) / (calculateFactorial(n) + 1))
    }
    return s;
}

function calculateFactorial(x) {
    if (x === 1 || x === 0) {
        return 1;
    }
    return x * calculateFactorial(x - 1);
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function validateNumeric(x0, xn, hx, y0, yn, hy, a, nm1, nm2) {
    return isNumeric(x0)
        && isNumeric(xn)
        && isNumeric(hx)
        && isNumeric(y0)
        && isNumeric(yn)
        && isNumeric(hy)
        && isNumeric(a)
        && isNumeric(nm1)
        && isNumeric(nm2);
}

function validateTabulationLimits(x0, xn, hx) {
    return ((x0 < xn && hx > 0) || (x0 > xn && hx < 0)) && x0 !== xn && hx !== 0;
}

function validateProductAndSumLimits(n) {
    return n >= 2 && n <= 6
}

function getTabulationPredicate(x0, xn) {
   if (x0 < xn) {
       return (x, xn, hx) => x <= (xn + hx / 3);
   } else {
       return (x, xn, hx) => x >= (xn - hx / 3);
   }
}

function calculateFuncValue(x, a, y, nm1, nm2) {
    let func;
    if (x < a) {
        func = calculateFirstFunc(x, y, nm1);
    } else {
        func = calculateSecondFunc(y, nm2);
    }
    return func;
}

function formOutput(x, y, func) {
    return "<tr><td>" + x + "</td><td>" + y + "</td><td>" + func + "</td></tr>";
}

function formOutputBeginning(x0, xn, hx, y0, yn) {
    return "<p>Результаты табулирования функции по x от " + x0 + " до " + xn + " с шагом "
        + hx + ",<br/>" + "по y от " + y0 + " до " + yn + " с шагом " + hx + ".<br/> </p>";
}

function formTableHeader() {
    return "<table><tr><th>X</th>\<th>Y</th><th>F</th></tr>";
}

function tabulateFunc(x0, xn, hx, xTabulationPredicate, y0, yn, hy, yTabulationPredicate, a, nm1, nm2) {
    let output = "";
    for (let x = x0; xTabulationPredicate(x, xn, hx); x += hx) {
        for (let y = y0; yTabulationPredicate(y, yn, hy); y += hy) {
            let func = calculateFuncValue(x, a, y, nm1, nm2);
            output += formOutput(x, y, func)
        }
    }
    return output;
}

function tabulate(x0, xn, hx, y0, yn, hy, a, nm1, nm2) {
    let resultDiv = document.getElementById("resultDiv")
    if (!validateNumeric(x0, xn, hx, y0, yn, hy, a, nm1, nm2)) {
        resultDiv.innerHTML = "<p>Неправильно введены числа!</p>"
        return;
    }

    x0 = parseFloat(x0);
    xn = parseFloat(xn);
    hx = parseFloat(hx);
    y0 = parseFloat(y0);
    yn = parseFloat(yn);
    hy = parseFloat(hy);
    a = parseFloat(a);
    nm1 = parseInt(nm1);
    nm2 = parseInt(nm2)

    if (!(validateTabulationLimits(x0, xn, hx) && validateTabulationLimits(y0, yn, hy))) {
        resultDiv.innerHTML = "<p>Некорректные ограничения для табулирования</p>"
        return;
    }
    if (!validateProductAndSumLimits(nm1)) {
        resultDiv.innerHTML = "<p>nm1: 2 <= nm1 <= 6</p>"
        return;
    }
    if (!validateProductAndSumLimits(nm2)) {
        resultDiv.innerHTML = "<p>nm1: 2 <= nm2 <= 6</p>"
        return;
    }
    let xTabulationPredicate = getTabulationPredicate(x0, xn);
    let yTabulationPredicate = getTabulationPredicate(y0, yn);

    resultDiv.innerHTML = formOutputBeginning(x0, xn, hx, y0, yn);

    let output = formTableHeader();
    output += tabulateFunc(x0, xn, hx, xTabulationPredicate, y0, yn, hy, yTabulationPredicate, a, nm1, nm2);
    resultDiv.innerHTML += output;
}

function clearDiv() {
    document.getElementById("resultDiv").innerHTML = ""
}

function clearForm() {
    document.getElementById("mainForm").reset();
}