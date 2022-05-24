const matrixSizeInputId = "matrixSize";
const outputDivId = "output";
const operationOutputDivId = "operationOutput";
const actionSelectDivId = "actionDiv";
const actionSelectId = "action";
const actionFormDivId = "actionFormDiv";
const getIInputId = "getI";
const getJInputId = "getJ";
const getIndicesDivId = "getIndicesDiv";
const setIndicesDivId = "setIndicesDiv";
const setIInputId = "setI";
const setJInputId = "setJ";
const setValueInputId = "setValue";

let matrix;

function generateMatrix() {
    clearOutput();
    changeOperationSelectDivVisibility(false);
    clearOperationOutputDiv();
    let size = getInputValue(matrixSizeInputId);
    matrix = new SquareMatrix(size);
    matrix.fillRandom(new Bounds(-100, 100));
    appendToOutput(document.createTextNode("Initial matrix: "))
    appendToOutput(getTableByMatrix(matrix));
    changeOperationSelectDivVisibility(true)
}

function getInputValue(inputId) {
    const input = document.getElementById(inputId);
    let value = Number(input.value);
    input.value = value;
    input.setAttribute("value", value.toString());
    return value;
}

function getTableByMatrix(matrix) {
    let table = document.createElement("table");
    matrix.arrayContainer.forEach(row => {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        row.forEach(element => {
            let td = document.createElement("td");
            tr.appendChild(td);
            td.appendChild(document.createTextNode(element))
        });
    });
    return table;
}

function changeOperationSelectDivVisibility(visibility) {
    getActionSelectDiv().hidden = !visibility;
}

function getActionSelectDiv() {
    return document.getElementById(actionSelectDivId);
}

function clearOutput() {
    getOutputDiv().innerHTML = "";
}

function getOutputDiv() {
    return document.getElementById(outputDivId);
}

function clearOperationOutputDiv() {
    getOperationOutputDiv().innerHTML = "";
}

function getOperationOutputDiv() {
    return document.getElementById(operationOutputDivId);
}

function appendToOperationOutputDiv(element) {
    getOperationOutputDiv().appendChild(element);
}

function appendToOutput(element) {
    getOutputDiv().appendChild(element);
}

function getActionSelect() {
    return document.getElementById(actionSelectId);
}

function action() {
    clearOperationOutputDiv();
    switch (getActionSelect().value) {
        case "toString":
            toStringAction();
            break;
        case "actionsList":
            logActionsAction();
            break;
        case "actionsListClear":
            clearActionsAction();
            break;
        case "get":
            getAction();
            break;
        case "set":
            setAction();
            break;
        case "min":
            getMinimalElementIndexAction();
            break;
        case "max":
            getMaximalElementIndexAction();
            break;
        case "add":
            addMatrixAction();
            break;
        case "sub":
            subMatrixAction();
            break;
        case "mul":
            mulMatrixAction();
            break;
    }
}

function toStringAction() {
    console.log(matrix.toString());
}

function logActionsAction() {
    matrix.logActions();

}

function clearActionsAction() {
    matrix.clearActions();
}

function getActionFormDiv() {
    return document.getElementById(actionFormDivId);
}

function getAction() {
    let i = getInputValue(getIInputId);
    let j = getInputValue(getJInputId);
    appendToOperationOutputDiv(document.createTextNode(`Element at [${i}][${j}]: ${matrix.getElement(i, j)}`));
}

function writeModifiedMatrix() {
    clearOutput();
    appendToOutput(document.createTextNode("Modified matrix: "))
    appendToOutput(getTableByMatrix(matrix));
}

function setAction() {
    let i = getInputValue(setIInputId);
    let j = getInputValue(setJInputId);
    let value = getInputValue(setValueInputId);
    matrix.setElement(i, j, value);
    writeModifiedMatrix();
}

function getMinimalElementIndexAction() {
    let minIndex = matrix.getMinIndex();
    appendToOperationOutputDiv(document.createTextNode(`Minimal element at [${minIndex.i}][${minIndex.j}]`));
}

function getMaximalElementIndexAction() {
    let maxIndex = matrix.getMaxIndex();
    appendToOperationOutputDiv(document.createTextNode(`Minimal element at [${maxIndex.i}][${maxIndex.j}]`));
}

function addMatrixAction() {
    performMatrixOperation(matrix.addMatrix, "adding", "+")
}

function performMatrixOperation(func, operation, sign) {
    let performingMatrix = new SquareMatrix(matrix.size);
    performingMatrix.fillRandom(new Bounds(-100, 100));
    appendToOperationOutputDiv(document.createTextNode(`Result of ${operation} matrices:`));
    appendToOperationOutputDiv(getTableByMatrix(matrix));
    appendToOperationOutputDiv(document.createTextNode(sign));
    appendToOperationOutputDiv(getTableByMatrix(performingMatrix));
    appendToOperationOutputDiv(document.createTextNode("="));
    func.call(matrix, performingMatrix);
    appendToOperationOutputDiv(getTableByMatrix(matrix));
    writeModifiedMatrix();
}

function subMatrixAction() {
    performMatrixOperation(matrix.subtractMatrix, "subtracting", "-");
}

function mulMatrixAction() {
    performMatrixOperation(matrix.multiplyMatrix, "multiplying", "*");
}

function hideAllActionForms() {
    getActionFormDiv().childNodes.forEach(element => element.hidden = true);
}

function handleSelectChanging() {
    hideAllActionForms();
    switch (getActionSelect().value) {
        case "get":
            document.getElementById(getIndicesDivId).hidden = false;
            break;
        case "set":
            document.getElementById(setIndicesDivId).hidden = false;
            break;
    }
}