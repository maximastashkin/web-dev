const sizeInputId = "arraySize";
const outputDivId = "outputDiv";
const errorDivId = "errorDiv";
const removingFormId = "removingForm";
const weightInputId = "weightNominal";
const addingFormId = "addingForm";
const gettingFormId = "gettingForm";
const serializingFormId = "serializingForm";
const serializedInputId = "serialized"
const generationFormId = "generatingForm"
const jsonFormId = "jsonForm"

let details;

function isIntNumeric(n) {
    n = parseInt(n);
    return !isNaN(n) && isFinite(n) && Number.isInteger(n);
}

function isFloatNumeric(n) {
    n = parseFloat(n);
    return !isNaN(n) && isFinite(n);
}

function setFormsVisibility() {
    document.getElementById(removingFormId).hidden = false;
    document.getElementById(addingFormId).hidden = false;
    document.getElementById(gettingFormId).hidden = false;
    document.getElementById(serializingFormId).hidden = false;
}

function generateArray(size) {
    clearOutput();
    if (!isIntNumeric(size)) {
        printErrorMessage(formSizeNanErrorMessage());
        return;
    }
    size = parseInt(size);
    changeInputValue(size);
    details = generateWithDrawing(size);
    setFormsVisibility();
}

function getNewTbody(isVolume = false) {
    let table = generateOutputTable(isVolume);
    document.getElementById(outputDivId).append(table);
    return table.tBodies[0];
}

function generateWithDrawing(size) {
    let outputTbody = getNewTbody();
    let details = generateRandomObjects(size, generateRandomDetail);
    details.forEach(detail => outputTbody.appendChild(generateRowByDetail(detail)));
    return details;
}

function generateOutputTable(isVolume) {
    let table = document.createElement("table");
    table.className = "output-table"
    let thead = document.createElement("thead");
    table.appendChild(thead);
    let upperTr = document.createElement("tr");
    thead.appendChild(upperTr);
    let th = document.createElement("th");
    th.setAttribute("rowspan", "2");
    th.appendChild(document.createTextNode("Name"));
    upperTr.appendChild(th);
    th = document.createElement("th");
    th.setAttribute("colspan", "3");
    th.appendChild(document.createTextNode("Dimensions"));
    upperTr.appendChild(th);
    if (isVolume) {
        th = document.createElement("th");
        th.setAttribute("rowspan", "2");
        th.appendChild(document.createTextNode("Volume"));
        upperTr.appendChild(th);
    }
    th = document.createElement("th");
    th.setAttribute("rowspan", "2");
    th.appendChild(document.createTextNode("Material"));
    upperTr.appendChild(th);
    th = document.createElement("th");
    th.setAttribute("rowspan", "2");
    th.appendChild(document.createTextNode("Weight"));
    upperTr.appendChild(th);
    th = document.createElement("th");
    th.setAttribute("colspan", "2");
    th.setAttribute("rowspan", "2");
    th.appendChild(document.createTextNode("Suppliers"));
    upperTr.appendChild(th);
    let lowerTr = document.createElement("tr")
    thead.appendChild(lowerTr)
    th = document.createElement("th")
    th.appendChild(document.createTextNode("Length"));
    lowerTr.appendChild(th);
    th = document.createElement("th")
    th.appendChild(document.createTextNode("Width"));
    lowerTr.appendChild(th);
    th = document.createElement("th")
    th.appendChild(document.createTextNode("Height"));
    lowerTr.appendChild(th)
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    return table;
}

function getTdWithTable(suppliers) {
    let td = document.createElement("td");
    td.setAttribute("colspan", "2");
    td.appendChild(generateTableBySuppliers(suppliers));
    return td;
}

function generateRowByDetail(detail, isVolume = false) {
    let tr = document.createElement("tr");
    tr.appendChild(getTd(detail.name));
    let length = detail.dimensions === undefined ? "" : detail.dimensions.length.toFixed(2);
    let width = detail.dimensions === undefined ? "" : detail.dimensions.width.toFixed(2);
    let height = detail.dimensions === undefined ? "" : detail.dimensions.height.toFixed(2);
    tr.appendChild(getTd(length));
    tr.appendChild(getTd(width));
    tr.appendChild(getTd(height));
    if (isVolume) {
        tr.appendChild(getTd(containsVolume(detail) ? detail.volume.toFixed(2) : ""))
    }
    tr.appendChild(getTd(detail.material));
    tr.appendChild(getTd(detail.weight.toFixed(2)))
    let td = getTdWithTable(detail.suppliers);
    tr.appendChild(td);
    return tr;
}

function getTd(value) {
    let td = document.createElement("td");
    td.appendChild(document.createTextNode(value));
    return td;
}

function generateTableBySuppliers(suppliers) {
    let table = document.createElement("table");
    table.className="inner-table";
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.appendChild(document.createTextNode("Name"));
    tr.appendChild(th);
    th = document.createElement("th");
    th.appendChild(document.createTextNode("Phone number"));
    tr.appendChild(th);
    table.appendChild(tr);
    for (let i = 0; i < suppliers.length; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        let td = document.createElement("td");
        td.appendChild(document.createTextNode(suppliers[i].name));
        tr.appendChild(td);
        td = document.createElement("td");
        td.appendChild(document.createTextNode(suppliers[i].phoneNumber));
        tr.appendChild(td);
    }
    return table;
}

function changeInputValue(value) {
    let input = document.getElementById(sizeInputId);
    input.value = value;
    input.setAttribute("value", value);
}

function formSizeNanErrorMessage() {
    return "Size must be a number!";
}

function printErrorMessage(message) {
    document.getElementById(errorDivId).appendChild(document.createTextNode(message));
}

function clearInput(inputId) {
    let input = document.getElementById(inputId);
    input.value = "";
    input.setAttribute("value", "");
}

function clearOutput() {
    document.getElementById(outputDivId).innerHTML = "";
    clearError();
    document.getElementById(removingFormId).hidden = true;
    document.getElementById(addingFormId).hidden = true;
    clearInput(weightInputId);
    clearInput(serializedInputId);
}

function clearError() {
    document.getElementById(errorDivId).innerText = "";
}

function formWeightNanErrorMessage() {
    return "Weight must be a number!";
}

function removeDimensionsForWeightLessThan(weight) {
    if (!isFloatNumeric(weight)) {
        printErrorMessage(formWeightNanErrorMessage())
        document.getElementById(errorDivId).scrollIntoView();
        return;
    }
    document.getElementById(outputDivId).appendChild(
        document.createTextNode(`Without dimensions with weight less than ${weight}: `))
    weight = parseFloat(weight);
    clearError();
    let deletingFunc = (detail) => deleteDimensionsForWeightLessThan(detail, weight);
    details = details.map(deletingFunc);
    let isVolume = hasAtLeastOneVolume(details);
    let tbody = getNewTbody(isVolume);
    details.forEach(detail => tbody.appendChild(generateRowByDetail(detail, isVolume)));
    clearInput(weightInputId);
}

function addVolumes() {
    document.getElementById(outputDivId).appendChild(document.createTextNode("Details with calculated volumes: "))
    details = details.map(addVolume);
    let hasVolume = hasAtLeastOneVolume(details);
    let tbody = getNewTbody(hasVolume);
    details.forEach(detail => tbody.appendChild(generateRowByDetail(detail, hasVolume)));
    document.getElementById(addingFormId).hidden = true;
}

function getSorted() {
    document.getElementById(outputDivId).appendChild(document.createTextNode("Sorted by weight descending: "))
    let hasVolume = hasAtLeastOneVolume(details);
    let tbody = getNewTbody(hasVolume);
    getDetailsInWeightDescendingOrder(details)
        .forEach(detail => tbody.appendChild(generateRowByDetail(detail, hasVolume)));
    document.getElementById(gettingFormId).hidden = true;
}

function serialize() {
    let value = JSON.stringify(details, undefined, 4);
    let input = document.getElementById(serializedInputId);
    input.value = value;
    input.setAttribute("value", value);
}

function loadFromJson(json) {
    clearOutput();
    try {
        details = JSON.parse(json);
        let hasVolume = hasAtLeastOneVolume(details);
        let tbody = getNewTbody(hasVolume);
        details.forEach(detail => tbody.appendChild(generateRowByDetail(detail, hasVolume)));
        setFormsVisibility();
    } catch {
        printErrorMessage("Error in json parsing!")
    }
}

function generationRadioOnChange() {
    changeInputFormVisibility();
}

function changeInputFormVisibility() {
    document.getElementById(jsonFormId).hidden = !document.getElementById(jsonFormId).hidden;
    document.getElementById(generationFormId).hidden = !document.getElementById(jsonFormId).hidden;
}

function jsonRadioOnChange() {
    changeInputFormVisibility();
}