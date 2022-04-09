const resultDivId = "resultDiv";
const resultTableId = "resultTable";
const updateDivId = "updateDiv";
const rowsDivId = "rowsDiv";
const rowsErrorPId = "rowsErrorP";

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function createTable(size) {
    if (!isNumeric(size)) {
        sendError("Размер должен быть числом! Повторите ввод.");
        return;
    }
    if (!validateByLimitations(size)) {
        sendError("Размер таблицы должен быть от 1 до 50! Повторите ввод.");
        return;
    }

    drawTable(generateTable(parseInt(size)));
}

function isBlueCell(size, j, i) {
    return Math.abs(Math.floor((size * 2 - 1) / 2) - j) === i;
}

function isRedCell(size, j, i) {
    return Math.abs(Math.floor((size * 2 - 1) / 2) - j) < i;
}

function generateTable(size) {
    let table = document.createElement("table");
    table.id = resultTableId;
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (let i = 0; i < size * 2 - 1; i++) {
        let tr = document.createElement("tr");
        tbody.appendChild(tr);
        for (let j = 0; j < (size * 2 - 1); j++) {
            let td = document.createElement("td");
            td.className = "cell"
            tr.appendChild(td);
            if (i < size) {
                if (isBlueCell(size, j, i)) {
                    let numberText = document.createTextNode((i + 1).toString());
                    td.className += " blue-cell"
                    td.appendChild(numberText);
                }
                if (isRedCell(size, j, i)) {
                    td.className += " red-cell"
                }
            }
        }
    }
    return table;
}

function rotateTable() {
    let table = document.getElementById(resultTableId);
    let rows = table.getElementsByTagName("tr");
    let tbody = document.createElement("tbody");

    for (let i = 0; i < rows.length; i++) {
        let tr = document.createElement("tr");
        tbody.appendChild(tr);
        for (let j = rows.length - 1; j >= 0; j--) {
            tr.appendChild(rows[j].children[i].cloneNode(true));
        }
    }
    table.replaceChild(tbody, table.getElementsByTagName("tbody")[0]);
}

function clearColorRows(rows) {
    let numbers = parseRows(rows)
    if (numbers != null) {
        let table = document.getElementById(resultTableId);
        let rows = table.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
            if (numbers.includes(i + 1)) {
                for (let j = 0; j < rows.length; j++) {
                    rows[i].children[j].className = "cell";
                }
            }
        }
    }
}

function writeSum() {
    let rows = document.getElementById(resultTableId).getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        writeNumberInRowRedCells(i + 1, getSum(row));
    }
}

function writeProud() {
    let rows = document.getElementById(resultTableId).getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        writeNumberInRowRedCells(i + 1, getProud(row));
    }
}

function getProud(row) {
    let proud = 1;
    for (let j = 0; j < row.children.length; j++) {
        let td = row.children[j];
        if (isNumeric(td.textContent)) {
            proud *= parseInt(td.textContent);
        }
    }
    return proud;
}

function getSum(row) {
    let sum = 0;
    for (let j = 0; j < row.children.length; j++) {
        let td = row.children[j];
        if (isNumeric(td.textContent)) {
            sum += parseInt(td.textContent);
        }
    }
    return sum;
}

function writeNumberInRowRedCells(rowNumber, writingNumber) {
    rowNumber = rowNumber - 1;
    let row = document.getElementById(resultTableId).getElementsByTagName("tr")[rowNumber];
    for (let i = 0; i < row.children.length; i++) {
        if (row.children[i].className.includes("red-cell")) {
            let td = row.children[i];
            if (td.lastChild != null) {
                td.lastChild.remove()
            }
            td.appendChild(document.createTextNode(writingNumber.toString()));
        }
    }
}

function parseRows(rows) {
    clearRowsNumberError()
    let numberStrings = rows.split(",");
    for (let str of numberStrings) {
        if (!isNumeric(str)) {
            sendRowNumbersError();
            return null;
        }
    }
    numberStrings = numberStrings.map(element => {
        return parseInt(element.trim());
    });
    return numberStrings;
}

function getRowsDiv() {
    return document.getElementById(rowsDivId);
}

function sendRowNumbersError() {
    let rowsDiv = getRowsDiv();
    let p = document.createElement("p");
    p.id = rowsErrorPId;
    p.innerText = "Все номера должны быть числами, записанными через запятую! Повторите ввод.";
    rowsDiv.appendChild(p);
}

function clearRowsNumberError() {
    let p = document.getElementById(rowsErrorPId);
    if (p != null) {
        p.remove();
    }
}

function drawTable(table) {
    clearResult();
    getResultDiv().appendChild(table);
    getUpdateDiv().hidden = false;
    document.getElementById("rowNumbers").value = "";
    clearRowsNumberError()
}

function validateByLimitations(size) {
    return size >= 1 && size <= 50
}

function sendError(errorMessage) {
    clearResult()
    let resultDiv = getResultDiv();
    resultDiv.className = "error";
    let errorP = document.createElement("p");
    errorP.innerText = errorMessage
    resultDiv.appendChild(errorP);
}

function clearResult() {
    let resultDiv = getResultDiv();
    resultDiv.innerHTML = " ";
    resultDiv.className = "";
    getUpdateDiv().hidden = true;
}

function getResultDiv() {
    return document.getElementById(resultDivId);
}

function getUpdateDiv() {
    return document.getElementById(updateDivId);
}