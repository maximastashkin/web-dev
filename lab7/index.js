const aInputId = "aValue";
const bInputId = "bValue";
const hInputId = "hValue";

const outputDivId = "output";
const errorDivId = "error";

function calculate() {
    clearOutput();
    clearError();
    let a = getInputValue(aInputId);
    let b = getInputValue(bInputId);
    let h = getInputValue(hInputId);
    if (!validateTabulatingParams(a, b, h)) {
        addErrorMessage("Tabulating params aren't valid! Try again");
        return;
    }

}

function getInputValue(inputId) {
    const input = document.getElementById(inputId);
    let value = Number(input.value);
    input.value = value;
    input.setAttribute("value", value);
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