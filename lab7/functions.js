function f1(x) {
    return x * Math.sqrt(Math.pow(Math.sin(x + 10), 3)) + (Math.pow(x, 3) - Math.cos(x)) / x;
}

function f2(x) {
    return Math.pow(Math.sin(x), 2) - Math.abs(Math.sin(x - 4));
}

function f3(x) {
    return Math.exp(x - 2) + Math.pow(x, 3) + 2 * x * Math.log(x + 3) / 7;
}

function getMin(a, b, h, f) {
    let min = Infinity;
    let tabPredicate = getTabulationPredicate(a, b);
    for (let i = a; tabPredicate(i, b, h); i += h) {
        let value = f(i);
        if (Number.isFinite(value) && value < min) {
            min = value;
        }
    }
    return min;
}

getMin.stringRepresentation = "Minimum value";

function isMonotonicallyDecreases(a, b, h, f) {
    let tabPredicate = getTabulationPredicate(a, h > 0 ? b - h : b + h);
    for (let i = 0; tabPredicate(i, b, h); i += h) {
        if (f(i + 1) > f(i)) {
            return false;
        }
    }
    return true;
}

isMonotonicallyDecreases.stringRepresentation = "Is monotonically decreases";

function findNullValuesCount(a, b, h, f) {
    let count = 0;
    let tabPredicate = getTabulationPredicate(a, b);
    for (let i = 0; tabPredicate(i, b, h); i += h) {
        if (f(i) === 0) {
            count++;
        }
    }
    return count;
}

findNullValuesCount.stringRepresentation = "Null values count";

function getMemoizedFunction(f) {
    const cache = {};
    let memoizedFunction = (x) => {
        if (x in cache) {
            return cache[x];
        }
        let value = f(x);
        cache[x] = value;
        return value;
    };
    memoizedFunction.getFromCache = (x) => {
        return cache[x];
    }
    memoizedFunction.getCacheSize = () => {
        return Object.keys(cache).length;
    }

    clone(f, memoizedFunction);
    return memoizedFunction;
}

function getDebuggingFunction(f) {
    let debuggingFunc = (x) => {
        let value = f(x);
        console.log(`${new Date()} f(${x}) = ${value}`)
        return value;
    };
    clone(f, debuggingFunc);
    return debuggingFunc;
}

function getFunctionWithCallsCount(f) {
    let callsCount = 0;
    let functionWithCallsCount = (x) => {
        callsCount++;
        return f(x);
    }
    functionWithCallsCount.getCallsCount = () => {
        return callsCount;
    }

    functionWithCallsCount.resetCallsCount = () => {
        callsCount = 0;
    }
    clone(f, functionWithCallsCount);
    return functionWithCallsCount;
}

function clone(src, dst) {
    for (let key in src) {
        dst[key] = src[key];
    }
}

function getTabulationPredicate(x0, xn) {
    if (x0 < xn) {
        return (x, xn, hx) => x <= (xn + hx / 3);
    } else {
        return (x, xn, hx) => x >= (xn - hx / 3);
    }
}
