function f1(x) {
    return x * Math.sqrt(Math.pow(Math.sin(x + 10), 3)) + (Math.pow(x, 3) - Math.cos(x)) / x;
}

function f2(x) {
    return Math.pow(Math.sin(x), 2) - Math.abs(Math.sin(x - 4));
}

function f3(x) {
    return Math.exp(x - 2) + Math.pow(x, 3) + 2 * x * Math.log(x + 3) / 7;
}