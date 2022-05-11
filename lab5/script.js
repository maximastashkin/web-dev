const m1OutputDivId = "m1OutputDiv"
const m2OutputDivId = "m2OutputDiv"
let m1Matrix;
let m2Matrix;
let m1Maxis;
let m1Minis;
let m2Maxis;
let m2Minis;

function isNumeric(n) {
    return !isNaN(parseInt(n)) && isFinite(n);
}

function validateMatrixSizesByLimitations(n) {
    n = parseInt(n);
    return n > 0 && n <= 50
}

function formErrorMsg(currentMessage) {
    if (currentMessage !== "") {
        currentMessage = "Error!!!\n" + currentMessage;
    }
    return currentMessage;
}

function generateMatrixErrorMessage(rows, columns, matrixName) {
    let errorMsg = "";
    if (!isNumeric(rows)) {
        errorMsg += `${matrixName} rows must be an integer\n`;
    } else if (!validateMatrixSizesByLimitations(rows)) {
        errorMsg += `${matrixName} rows must be greater than 0 and greater than or equals to 50\n`;
    }
    if (!isNumeric(columns)) {
        errorMsg += `${matrixName} columns must be an integer\n`;
    } else if (!validateMatrixSizesByLimitations(columns)) {
        errorMsg += `${matrixName} columns must be greater than 0 and greater than or equals to 50\n`;
    }
    return formErrorMsg(errorMsg);
}

function generateBoundsErrorMessage(lower, upper) {
    let errorMsg = "";
    if (!isNumeric(lower)) {
        errorMsg += "Lower bound must be an integer value\n";
    }
    if (!isNumeric(upper)) {
        errorMsg += "Upper bound must be and integer valuer\n";
    }
    return formErrorMsg(errorMsg);
}

function transformBorders(lowerBound, upperBound) {
    let bounds = {lower: lowerBound, upper: upperBound};
    if (upperBound < lowerBound) {
        transformBordersInDocument(lowerBound, upperBound);
        bounds.lower = upperBound;
        bounds.upper = lowerBound;
    }
    return bounds;
}

function transformBordersInDocument(lower, upper) {
    let lowerBound = document.getElementById("lowerBound");
    lowerBound.value = upper;
    lowerBound.setAttribute("value", upper);
    let upperBound = document.getElementById("upperBound");
    upperBound.value = lower;
    upperBound.setAttribute("value", lower);
}

function generateMatrices(m1Rows, m1Columns, m2Rows, m2Columns, lowerBound, upperBound) {
    clearOutput();
    if (isNumeric(lowerBound) && isNumeric(upperBound)) {
        lowerBound = parseInt(lowerBound);
        upperBound = parseInt(upperBound);
        let bounds = transformBorders(lowerBound, upperBound);
        if (isNumeric(m1Rows) && validateMatrixSizesByLimitations(m1Rows) && isNumeric(m1Columns) && validateMatrixSizesByLimitations(m1Columns)) {
            m1Rows = parseInt(m1Rows);
            m1Columns = parseInt(m1Columns);
            m1Matrix = generateMatrix(m1Rows, m1Columns, bounds);
            writeTable(m1OutputDivId, "M1", generateTableByMatrix(m1Matrix));
            drawModifyButton(m1OutputDivId);
        } else {
            writeError(m1OutputDivId, generateMatrixErrorMessage(m1Rows, m1Columns, "M1"));
        }

        if (isNumeric(m2Rows) && validateMatrixSizesByLimitations(m2Rows) && isNumeric(m2Columns) && validateMatrixSizesByLimitations(m2Columns)) {
            m2Rows = parseInt(m2Rows);
            m2Columns = parseInt(m2Columns);
            m2Matrix = generateMatrix(m2Rows, m2Columns, bounds);
            writeTable(m2OutputDivId, "M2", generateTableByMatrix(m2Matrix));
            drawModifyButton(m2OutputDivId);
        } else {
            writeError(m2OutputDivId, generateMatrixErrorMessage(m2Rows, m2Columns, "M2"));
        }
    } else {
        writeError(m1OutputDivId, generateBoundsErrorMessage(lowerBound, upperBound));
    }
}

function writeTable(divId, tableName, table) {
    let div = document.getElementById(divId);
    let tableDiv = document.createElement("div");
    tableDiv.appendChild(document.createTextNode(`${tableName} matrix:`))
    tableDiv.appendChild(table)
    div.appendChild(tableDiv);
}

function changeMatrix(matrix, divId) {
    matrix = performActionWithMatrix(
        matrix, divId, performMatrix, "modified", "ModifyButton");
    if (getMatrixNameFromDivId(divId) === "m1") {
        m1Matrix = matrix;
    } else {
        m2Matrix = matrix;
    }
    drawMinMaxButtons(divId);
}

function getMinis(matrix, divId) {
    let minis = performActionWithMatrix(
        matrix, divId, getMatrixMinis, "minis", "MinisButton");
    if (getMatrixNameFromDivId(divId) === "m1") {
        m1Minis = minis;
    } else {
        m2Minis = minis;
    }
    drawRemoveMinisButton(divId);
}

function getMaxis(matrix, divId) {
    let maxis = performActionWithMatrix(
        matrix, divId, getMatrixMaxis, "maxis", "MaxisButton"
    );
    if (getMatrixNameFromDivId(divId) === "m1") {
        m1Maxis = maxis;
    } else {
        m2Maxis = maxis;
    }
    drawRemoveMaxisButton(divId);
}

function getMatrixNameFromDivId(divId) {
    return divId.substring(0, 2);
}

function removeMinis(matrix, divId) {
    if (getMatrixNameFromDivId(divId) === "m1") {
        m1Matrix = performRemovingActionWithMatrix(
            matrix,
            divId,
            fullyRemoveElementsByRowFromMatrix,
            m1Minis,
            "without minis",
            "RemoveMinisButton"
        )
    } else {
        m2Matrix = performRemovingActionWithMatrix(
            matrix,
            divId,
            fullyRemoveElementsByRowFromMatrix,
            m1Minis,
            "without minis",
            "RemoveMinisButton")
    }
}

function removeMaxis(matrix, divId) {
    if (getMatrixNameFromDivId(divId) === "m1") {
        m1Matrix = performRemovingActionWithMatrix(
            matrix,
            divId,
            fullyRemoveElementsByRowFromMatrix,
            m1Maxis,
            "without maxis",
            "RemoveMaxisButton");
    } else {
        m2Matrix = performRemovingActionWithMatrix(
            matrix,
            divId,
            fullyRemoveElementsByRowFromMatrix,
            m2Maxis,
            "without maxis",
            "RemoveMaxisButton");
    }
}

function performRemovingActionWithMatrix(matrix, divId, func, deletingVector, newMatrixDescription, deletingButtonName) {
    let newMatrix = func(matrix, deletingVector);
    drawDivAfterAction(divId, getMatrixNameFromDivId(divId), newMatrixDescription, newMatrix, deletingButtonName);
    return newMatrix;
}

function performActionWithMatrix(matrix, divId, func, newMatrixDescription, deletingButtonName) {
    let newMatrix = func(matrix);
    let matrixName = getMatrixNameFromDivId(divId);
    drawDivAfterAction(divId, matrixName, newMatrixDescription, newMatrix, deletingButtonName);
    return newMatrix;
}

function drawDivAfterAction(divId, matrixName, newMatrixDescription, matrix, deletingButtonName) {
    writeTable(divId, `${matrixName.toUpperCase()} ${newMatrixDescription} `, generateTableByMatrix(matrix));
    document.getElementById(matrixName + deletingButtonName).remove();
}

function drawMinMaxButtons(divId) {
    let buttonDiv = getButtonDiv(divId);
    let matrixName = getMatrixNameFromDivId(divId);
    let minButton = getButton(matrixName, divId);
    buttonDiv.appendChild(minButton);
    setupButton(
        minButton,
        `getMinis(${matrixName + "Matrix"}, "${divId}")`,
        `Get minis of ${matrixName} matrix`,
        matrixName + "MinisButton");
    let maxButton = getButton(matrixName, divId);
    buttonDiv.appendChild(maxButton);
    setupButton(
        maxButton,
        `getMaxis(${matrixName + "Matrix"}, "${divId}")`,
        `Get maxis of ${matrixName} matrix`,
        matrixName + "MaxisButton");
}

function drawRemoveMinisButton(divId) {
    let buttonDiv = getButtonDiv(divId);
    let matrixName = getMatrixNameFromDivId(divId);
    let removeMinisButton = getButton(matrixName, divId);
    buttonDiv.appendChild(removeMinisButton);
    setupButton(
        removeMinisButton,
        `removeMinis(${matrixName + "Matrix"}, "${divId}")`,
        `Remove minis from ${matrixName} matrix`,
        matrixName + "RemoveMinisButton");
}

function drawRemoveMaxisButton(divId) {
    let buttonDiv = getButtonDiv(divId);
    let matrixName = getMatrixNameFromDivId(divId);
    let removeMaxisButton = getButton(matrixName, divId);
    buttonDiv.appendChild(removeMaxisButton);
    setupButton(
        removeMaxisButton,
        `removeMaxis(${matrixName + "Matrix"}, "${divId}")`,
        `Remove maxis from ${matrixName} matrix`,
        matrixName + "RemoveMaxisButton");
}

function drawModifyButton(divId) {
    let buttonDiv = getButtonDiv(divId);
    let matrixName = getMatrixNameFromDivId(divId);
    ;
    let button = getButton(buttonDiv, matrixName, divId);
    buttonDiv.appendChild(button);
    setupButton(
        button,
        `changeMatrix(${matrixName + "Matrix"}, "${divId}")`,
        `Modify ${matrixName} matrix: even numbers gets to start - odd numbers gets to end`,
        matrixName + "ModifyButton");
}

function getButtonDiv(parentDivId) {
    let div = document.getElementById(parentDivId);
    let buttonDiv = document.createElement("div");
    div.appendChild(buttonDiv);
    return div;
}

function getButton(matrixName, divId) {
    let button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("class", "modifyButton");
    return button;
}

function setupButton(button, onclick, value, id) {
    button.setAttribute("onclick", onclick);
    button.setAttribute("value", value);
    button.setAttribute("id", id);
}

function generateTableByMatrix(matrix) {
    let table = document.createElement("table");
    table.className = "matrixTable"
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (let i = 0; i < matrix.length; i++) {
        let tr = document.createElement("tr");
        tbody.appendChild(tr);
        for (let j = 0; j < matrix[i].length; j++) {
            let td = document.createElement("td");
            tr.appendChild(td);
            td.appendChild(document.createTextNode(matrix[i][j]));
        }
    }
    return table;
}

function writeError(divId, message) {
    let outputDiv = document.getElementById(divId);
    clear(outputDiv);
    let errorDiv = document.createElement("div");
    errorDiv.className = "errorDiv";
    errorDiv.innerText = message;
    outputDiv.appendChild(errorDiv);
}

function clearOutput() {
    clear(document.getElementById(m1OutputDivId));
    clear(document.getElementById(m2OutputDivId));
}

function clear(element) {
    element.innerHTML = "";
}