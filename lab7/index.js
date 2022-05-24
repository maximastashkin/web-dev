const aInputId = "aValue";
const bInputId = "bValue";
const hInputId = "hValue";

const outputDivId = "output";
const errorDivId = "error";

const f1RadioId = "f1";
const f2RadioId = "f2";
const f3RadioId = "f3";

const minimumCheckBoxId = "minimum";
const isMonotonicallyDecreasesCheckBoxId = "isMonotonicallyDecreases";
const zeroValuesCountCheckBoxId = "zeroValuesCount";

const memoizationCheckBoxId = "memoization";
const debuggingCheckBoxId = "debugging";
const callsCountCheckBoxId = "callsCount";

const callsCountDivId = "callsCountDiv"

function clearAll() {
    clearOutput();
    clearError();
    clearCallsCount();
}

function calculate() {
    clearAll();
    let a = getInputValue(aInputId);
    let b = getInputValue(bInputId);
    let h = getInputValue(hInputId);
    if (!validateTabulatingParams(a, b, h)) {
        addErrorMessage("Tabulating params aren't valid! Try again");
        return;
    }
    let f = getFunctionsVariant(getFunction());
    let results = calculateFunctionCharacteristics(a, b, h, f, getCharacteristicsFunctions());
    appendToOutput(getResultTable(results));

    if (f.hasOwnProperty("getCallsCount")) {
        setCallsCount(f.getCallsCount());
    }
}

function getInputValue(inputId) {
    const input = document.getElementById(inputId);
    let value = Number(input.value);
    input.value = value;
    input.setAttribute("value", value.toString());
    return value;
}

function validateTabulatingParams(a, b, h) {
    return (h > 0 && a < b) || (h < 0 && a > b);
}

function addErrorMessage(message) {
    getErrorDiv().appendChild(
        document.createTextNode(message)
    );
}

function clearCallsCount() {
    getCallsCountDiv().innerHTML = "";
}

function setCallsCount(callsCount) {
    clearCallsCount();
    getCallsCountDiv().appendChild(document.createTextNode(
        `Function calls count: ${callsCount}`
    ));
}

function clearError() {
    getErrorDiv().innerHTML = "";
}

function getErrorDiv() {
    return document.getElementById(errorDivId);
}

function clearOutput() {
    getOutputDiv().innerHTML = "";
}

function getOutputDiv() {
    return document.getElementById(outputDivId);
}

function getCallsCountDiv() {
    return document.getElementById(callsCountDivId);
}

function getFunction() {
    if (isChecked(f1RadioId)) {
        return f1;
    }
    if (isChecked(f2RadioId)) {
        return f2;
    }
    if (isChecked(f3RadioId)) {
        return f3;
    }
}

function getCharacteristicsFunctions() {
    let functions = [];
    if (isChecked(minimumCheckBoxId)) {
        functions.push(getMin);
    }
    if (isChecked(isMonotonicallyDecreasesCheckBoxId)) {
        functions.push(isMonotonicallyDecreases);
    }
    if (isChecked(zeroValuesCountCheckBoxId)) {
        functions.push(findNullValuesCount)
    }
    return functions;
}

function getFunctionsVariant(f) {
    if (isChecked(memoizationCheckBoxId)) {
        f = getMemoizedFunction(f);
    }
    if (isChecked(debuggingCheckBoxId)) {
        f = getDebuggingFunction(f);
    }
    if (isChecked(callsCountCheckBoxId)) {
        f = getFunctionWithCallsCount(f);
    }
    return f;
}

function calculateFunctionCharacteristics(a, b, h, f, characteristics) {
    let result = [];
    characteristics.forEach(func => {
        result.push({
            name: func.stringRepresentation,
            characteristic: func(a, b, h, f)
        });
    })
    return result;
}

function isChecked(checkBoxId) {
    return document.getElementById(checkBoxId).checked;
}

function getResultTable(results) {
    let table = document.createElement("table");
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    results.forEach(result => tbody.appendChild(
        getTrByCharacteristic(result)
    ));
    return table;
}

function getTrByCharacteristic(characteristic) {
    let tr = document.createElement("tr");
    let titleTd = document.createElement("td");
    titleTd.appendChild(document.createTextNode(characteristic.name));
    tr.appendChild(titleTd);
    let valueTd = document.createElement("td");
    valueTd.appendChild(document.createTextNode(characteristic.characteristic));
    tr.appendChild(valueTd);
    return tr;
}

function appendToOutput(element) {
    getOutputDiv().appendChild(element);
}