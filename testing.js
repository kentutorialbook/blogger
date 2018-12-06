const unit = a => [a];






const plus9 = n => unit(n + 9);


const oddFilter = n =>
    n % 2 === 1
        ? unit(n)
        : [];

const array1 = [1, 2, 3, 4, 5];

const array3 = array1
    .flatMap(plus9)
    .flatMap(oddFilter);

const plus9oddFilter = a =>
    unit(a)
        .flatMap(plus9)
        .flatMap(oddFilter);

const array4 = array1
    .flatMap(plus9oddFilter);

console.log(array4);

const oddFilter = a =>
    a % 2 === 1
        ? unit(a)
        : [];

const array1 = [1, 2, 3, 4, 5];
const array2 = array1
    .flatMap(oddFilter);

console.log(array2);