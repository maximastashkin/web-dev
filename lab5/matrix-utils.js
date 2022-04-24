function generateMatrix(rows, columns, bounds) {
    let matrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            row.push(Math.floor(Math.random() * (bounds.upper - bounds.lower)) + bounds.lower);
        }
        matrix.push(row);
    }
    return matrix;
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