// noinspection JSPotentiallyInvalidUsageOfThis

function SquareMatrix(size) {
    this.size = size;
    this.arrayContainer = generateEmptySquareMatrix(size);

    function generateEmptySquareMatrix(size) {
        return new Array(size).fill(0).map(_ => new Array(size));
    }

    this.toString = function () {
        this.registerAction("toString");
        return `Square matrix with size=${this.size}:\n` +
            this.arrayContainer.map(row => row.join(" ")).join("\n");
    }

    this.fillRandom = function (bounds) {
        this.registerAction("fillRandom", bounds);
        this.arrayContainer.forEach(row => row.fill(0))
        this.arrayContainer = this.arrayContainer.map(row =>
            row.map(() => getRandomInBounds(bounds)))
    }

    function getRandomInBounds(bounds) {
        return Math.floor(Math.random() * (bounds.upper - bounds.lower)) + bounds.lower;
    }

    this.getElement = function (i, j) {
        this.registerAction("getElement", i, j);
        return this.arrayContainer[i][j];
    }

    this.setElement = function (i, j, value) {
        this.registerAction("setElement", i, j, value);
        this.arrayContainer[i][j] = value;
    }

    this.getMinIndex = function () {
        this.registerAction("getMinIndex");
        return getIndicesOfBy(this.arrayContainer, minPredicate, Number.POSITIVE_INFINITY);
    }

    this.getMaxIndex = function () {
        this.registerAction("getMaxIndex");
        return getIndicesOfBy(this.arrayContainer, maxPredicate, Number.NEGATIVE_INFINITY);
    }

    function getIndicesOfBy(array, predicate, init) {
        let vector = array.map(row => getValueWithIndexBy(row, predicate, init));
        let valueWithIndex = getValueWithIndexBy(vector, predicate, init);
        return {i: valueWithIndex.index, j: vector[valueWithIndex.index].index};
    }

    function getValueWithIndexBy(array, predicate, init) {
        let current = init;
        let currentIndex = -1;
        array.forEach((value, i) => {
            if (value.hasOwnProperty('value')) {
                value = value.value;
            }
            if (predicate(value, current)) {
                currentIndex = i;
                current = value;
            }
        });
        return {index: currentIndex, value: current};
    }

    function minPredicate(x, y) {
        return x < y;
    }

    function maxPredicate(x, y) {
        return x > y;
    }

    this.addMatrix = function (matrix) {
        this.registerAction("addMatrix", matrix);
        this.arrayContainer = performSimpleOperationWithMatrix.call(this, matrix, performAddingWithElement);
    }

    this.subtractMatrix = function (matrix) {
        this.registerAction("subtractMatrix", matrix);
        if (!validateMatricesOperation.call(this, matrix)) {
            return;
        }
        this.arrayContainer = performSimpleOperationWithMatrix.call(this, matrix, performSubtractingWithElement);
    }

    function performSimpleOperationWithMatrix(matrix, elementPerformingFunc) {
        return this.arrayContainer.map((row, i) =>
            row.map((element, j) => {
                return elementPerformingFunc(element, matrix.getElement(i, j));
            }));
    }

    function validateMatricesOperation(matrix) {
        let isValid = this.size === matrix.size;
        if (!isValid) {
            alert("Error! The dimensions of the matrices must be the same");
        }
        return isValid;
    }

    function performAddingWithElement(acceptor, receptor) {
        return acceptor + receptor;
    }

    function performSubtractingWithElement(acceptor, receptor) {
        return acceptor - receptor;
    }

    this.multiplyMatrix = function (matrix) {
        this.registerAction("multiplyMatrix", matrix);
        if (!validateMatricesOperation.call(this, matrix)) {
            return;
        }
        this.arrayContainer = performMultiplying.call(this, matrix);
    }

    function performMultiplying(matrix) {
        let newContainer = generateEmptySquareMatrix(this.size);
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                newContainer[i][j] = 0;
                for (let k = 0; k < this.size; k++) {
                    newContainer[i][j] += (this.arrayContainer[i][k] * matrix.getElement(k, j));
                }
            }
        }
        return newContainer;
    }
}

//BaseObject
SquareMatrix.prototype.actions = [];
SquareMatrix.prototype.registerAction = function (functionName, ...args) {
    this.actions.push({
        functionName: functionName,
        date: JSON.stringify(new Date()),
        args: args
    });
}
SquareMatrix.prototype.clearActions = function () {
    this.actions = [];
}
SquareMatrix.prototype.logActions = function () {
    console.log(this.actions);
}

//---------------

function Bounds(lower, upper) {
    this.lower = lower;
    this.upper = upper;
}

function test() {
    let matrix = new SquareMatrix(3);
    matrix.fillRandom(new Bounds(-5, 5));
    console.log(matrix.toString());
    matrix.multiplyMatrix(matrix);
    console.log(matrix.toString());
}