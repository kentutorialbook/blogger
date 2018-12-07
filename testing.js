const unit = Array.of;

const a = [1, 2];
const f = a =>
    a.flatMap(a => [a, a * 5]);

const left = unit(a).flatMap(f);
const center = f(a);
const right = f(a).flatMap(unit);

console.log(left);
console.log(center);
console.log(right);