const Materials = {WOOD: "wood", METAL: "metal", PLASTIC: "plastic"};
const randomStringSymbols = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const randomPhoneNumberSymbols = "1234567890"
const phoneNumberBase = "+79"

const minLength = 5;
const maxLength = 100;

const minWidth = 1;
const maxWidth = 50;

const minHeight = 10;
const maxHeight = 100

const minNameLength = 3;
const maxNameLength = 15;

const minWeight = 1;
const maxWeight = 100;

const minSuppliersSize = 1;
const maxSuppliersSize = 5;

function Detail(name, dimensions, material, weight, suppliers) {
    this.name = name;
    this.dimensions = dimensions;
    this.material = material;
    this.weight = weight;
    this.suppliers = suppliers;
}

function generateRandomDetail() {
    return new Detail(
        generateRandomString(
            getRandomIntInBounds(minNameLength, maxNameLength),
            randomStringSymbols
        ),
        generateRandomDimensions(),
        getRandomMaterial(),
        generateRandomFloatInBounds(minWeight, maxWeight),
        generateRandomObjects(
            getRandomIntInBounds(minSuppliersSize, maxSuppliersSize),
            generateRandomSupplier
        )
    );
}

function getRandomMaterial() {
    let keys = Object.keys(Materials);
    return keys[Math.floor(Math.random() * keys.length)];
}

function generateRandomObjects(size, generateFunction) {
    let result = new Array(size);
    for (let i = 0; i < size; i++) {
        result[i] = generateFunction();
    }
    return result;
}

function Dimensions(length, width, height) {
    this.length = length;
    this.width = width;
    this.height = height;
}

function generateRandomDimensions() {
    return new Dimensions(
        generateRandomFloatInBounds(minLength, maxLength),
        generateRandomFloatInBounds(minWidth, maxWidth),
        generateRandomFloatInBounds(minHeight, maxHeight)
    );
}

function Supplier(name, phoneNumber) {
    this.name = name;
    this.phoneNumber = phoneNumber;
}

function generateRandomSupplier() {
    return new Supplier(
        generateRandomString(
            getRandomIntInBounds(minNameLength, maxNameLength),
            randomStringSymbols
        ),
        phoneNumberBase + generateRandomString(9, randomPhoneNumberSymbols)
    );
}

function generateRandomFloatInBounds(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomIntInBounds(min, max) {
    return Math.ceil(generateRandomFloatInBounds(min, max));
}

function generateRandomString(length, chars) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

function deleteDimensionsForWeightLessThan(detail, weight) {
    if (detail.weight < weight) {
        delete detail.dimensions;
    }
    return detail;
}

function addVolume(detail) {
    if (detail.dimensions !== undefined) {
        detail.volume = detail.dimensions.length * detail.dimensions.width * detail.dimensions.height;
    }
    return detail
}

function containsVolume(detail) {
    return detail.volume !== undefined;
}

function hasAtLeastOneVolume(details) {
    let result = false;
    details.forEach(detail => result = result || containsVolume(detail));
    return result;
}

function detailWeightComparator(first, second) {
    if (first.weight < second.weight) {
        return - 1;
    }
    if (first.weight > second.weight) {
        return 1;
    }
    return 0;
}

function getDetailsInWeightDescendingOrder(details) {
    return [...details].sort(detailWeightComparator).reverse();
}