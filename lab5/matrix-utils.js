function getRandomInBounds(bounds) {
    return Math.floor(Math.random() * (bounds.upper - bounds.lower)) + bounds.lower;
}

function generateMatrix(rows, columns, bounds) {
    let matrix = new Array(rows).fill(new Array(columns));
    matrix.forEach(row => row.fill(0))
    return matrix.map(row =>
        row.map(() => getRandomInBounds(bounds)));
}

function performArray(array) {
    return array.filter(element => element % 2 === 0).concat(array.filter(element => element % 2 !== 0));
}

function performMatrix(matrix) {

    return matrix.map(row => performArray(row));
}

function getMatrixMinis(matrix) {
    return matrix.map(row => [Math.min(...row)]);
}

function getMatrixMaxis(matrix) {
    return matrix.map(row => [Math.max(...row)]);
}

function fullyRemoveFromArray(array, removingElement) {
    return array.filter(element => element !== removingElement);
}

function fullyRemoveElementsByRowFromMatrix(matrix, vector) {
    return matrix.map((row, index) => fullyRemoveFromArray(row, vector[index][0]));
}