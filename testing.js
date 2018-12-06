const unit = a => [a];






const plus9 = a =>
    unit(a)
        .flatMap(n => unit(n + 9));


const oddFilter = a =>
    unit(a)
        .flatMap(n =>
            n % 2 === 1
                ? unit(n)
                : []
        );

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

