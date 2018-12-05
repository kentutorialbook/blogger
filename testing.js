
const unit = a => [a];

const a = [1, 2];
const f = a =>
 a.flatMap(a => [a * 10, a * 100]);

const left = unit(a).flatMap(f);
const center = f(a);
const right = f(a).flatMap(unit);

console.log(left);
console.log(center);
console.log(right);

{
 const f = array =>
  [array]
   .flatMap(a => [a * 2])
   .flatMap(a => [a + 1]);

 const array1 = [1, 2, 3, 4, 5].flatMap(f);

 console.log(array1);
}
{
 const array1 =
  [1, 2, 3]
   .flatMap(a => [a * 2])
   .flatMap(a => [a + 1])

 console.log(array1);
}
{
 const array1 =
  [1, 2, 3]
   .flatMap(a =>
    [a]
     .flatMap(a => [a * 2])
     .flatMap(a => [a + 1])
   );

 console.log(array1);
}


/*







console.log(
    array1
        .flatMap(a =>

            a % 2 === 1
                ? [[a]]
                : [[]]
        )

);


console.log(
    array1
        .map(a =>

            a % 2 === 1
                ? a
                : undefined
        )
    // .flat()

);



const unit = a => [a];
const f = a => [a * 2];

//self structure

console.log(

    unit(3)
        .flatMap(f)

);

console.log(

    f(3)

);



console.log(

    [3].flatMap(a => [a])

);

console.log(

    f(3).flatMap(unit)

);

console.log(

    unit(3).flatMap(unit)

); //unit  * unit = unit


console.log(
    "==================="
);
{
    const f = a => [a * 2];
    const g = a => [a + 1];
    console.log(

        unit(3)
    );

    console.log(

        unit(3)
            .flatMap(f)
    );

    {
        console.log(

            unit(3)
                .flatMap(f)
                .flatMap(g)
        );


        const h = a => unit(a)
            .flatMap(f)
            .flatMap(g);


        console.log(
            unit(3)
                .flatMap(h)
        );
    }
}
console.log(
    "==================="
);
{
    const f = a => a * 2;
    const g = a => a + 1;
    console.log(

        unit(3)
            .map(f)
            .map(g)
    );


    const h = a => [a]
        .map(f)
        .map(g);


    console.log(
        unit(3)
            .map(h)
    );
}

//map implementation differentials




Object.defineProperty(
    Number.prototype,
    "plus", {
        value: function (val) {
            return this + val;
        }
    });

//plus(plus(plus(1)(2))(5))(9)

console.log((1).plus(9))

console.log(
    "Hello world"
        .replace("Hello", "Hi")
        .replace("world", "JavaScript")

);

{
    const e = Number;

    Object.defineProperty(
        e.prototype,
        "map", {
            value: function (f) {
                return f(this);
            }
        });
    const f = a => a * 2;
    console.log(
        e(1).map(f)
    );

    console.log(
        e(1).map(e)
    );

    console.log(
        e(1) === 1
    );

}

const a = {};


Object.defineProperty(a,
    "now", {
        set: (x) => {
            console.log(x);
        }
    });


{

    Object.defineProperty(a,
        "now", {
            set: (x) => {
                console.log(x);
            }
        });
}
a.now = 999;

*/