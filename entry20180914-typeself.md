# JavaScript/TypeScriptに自己参照する「型」(type)を与えるtypeself 

---

JavaScriptにはかなりざっくりとした範囲で[データ型(type)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Grammar_and_types#Data_structures_and_types)があり、[typeof 演算子](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/typeof)でその型を判定可能ですが、それより細やかなデータ型の区分けが出来たほうが便利です。

JavaScriptに静的型付けの枠組みを与えるのが、[TypeScript](http://www.typescriptlang.org/)ですが、まったくユニークな属性を与える型を定義することできません。

[typeself](https://www.npmjs.com/package/typeself) (https://github.com/kenokabe/typeself)

では、関数名をユニークな型名とし、任意のデータに型付けが可能です。


もっとも単純な例として、入力をそのまま出力する、ある恒等関数(identity function）`Member = a => a` をひとつの「型」`Type(Member)` として定義します。

```js
const  Member  = (a) =>  Type(Member)(a);
```

このとき、Member関数は入力値`a`にMember関数自体を属性として追加した`a`の[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)を出力しています。

次にそれぞれの名前（文字列）を値としてもつ`alice`と`bob`を定義しますが、`alice`は通常のとおりとし、`bob`は、すでに定義した`Member`型を与えながら定義しておきます。

```js
const  alice  =  "Alice";
const  bob  =  Member("Bob");
```

ユニークな型付けされたデータは、proxyなのでオリジナルと同様の振る舞いをします。ただし、オブジェクトそのものを表示した場合は、proxyオブジェクトであると区別できます。

`Type(Member)`  として型付けされているデータか否かは、  
`isType(Member)`の真偽値(true/false)で判定できます。

```js
log(
"Member status of "  +  alice
);//Member status of Alice
log(
isType(Member)(alice)
);//false
log(
"Member status of "  +  bob
);//Member status of Bob
log(
isType(Member)(bob)
);//true
```

The original concept introduced in [SICP](http://mitpress.mit.edu/sites/default/files/sicp/index.html) as "TypeTag".
 
## Install
 
### ESM

ES Modules are distributed as

- `./dist/build/modules/typeself.js`
- `./dist/build/modules/primitive-obj.js`

```js
import { Type, isType } from "./dist/build/modules/typeself.js";
```

### CJS

#### npm

Using npm:

```sh
$ npm i typeself
```

In Node.js:

```js
const { Type, isType } = require("typeself");
```

## Test

```sh
$ node -r esm ./dist/build/index.js
```

### ./test/test-typeself.js


```js
import { log } from "./log";
import { Type, isType } from "../modules/typeself";

const test_typeself = () => {
  log("=Are you a member??? ========= ");
  const Member = (a: string) => Type(Member)([a]);
  const alice = "Alice";
  const bob = Member("Bob");
  log(
    "Member status of " + alice
  );//Member status of Alice
  log(
    isType(Member)(alice)
  );//false
  log(
    "Member status of " + bob
  );//Member status of Bob
  log(
    isType(Member)(bob)
  );//true

  log("=Is this a special operation??========= ");
  const specialOperation = (f: Function) => Type(specialOperation)(f);

  const f1 = (a: number) => a + 1; //vanilla function
  const f2 = Type(specialOperation) //typed function
    ((a: number) => {
      //This function might be considered to be "special" 
      //because it does some featured operations in a context.
      return a * 2;
    });

  log(
    isType(specialOperation)(f1)
  );//false
  log(
    f1(1) // f1 = a => a +1
  );//2  // just in case, let you know
  log(
    isType(specialOperation)(f2)
  );//true
  log(
    f2(1) // f2 = a => a * 2
  );//2  // just in case, let you know

  log("=type test of nontyped=========================");
  const I = (a: undefined) => a;  //just a dummy function

  log(
    isType(I)(I) // true
  );
  log(
    isType(I)(1) // false
  );
  log(
    isType(I)([]) // false
  );
  log(
    isType(I)({}) // false
  );
  log(
    isType(I)("hello") //fakse
  );
  log(
    isType(I)((x: undefined) => x) // false
  );
  log(
    isType(I)(true) // false
  );
  log(
    isType(I)(false) // false
  );

  log("=type test of typed=========================");

  log(
    isType(I)(Type(I)(I)) // true
  );
  log(
    isType(I)(Type(I)(1)) // true
  );
  log(
    isType(I)(Type(I)([])) // true
  );
  log(
    isType(I)(Type(I)({})) // true
  );
  log(
    isType(I)(Type(I)("hello")) //true
  );
  log(
    isType(I)(Type(I)((x: undefined) => x)) // true
  );
  log(
    isType(I)(Type(I)(true)) // true
  );
  log(
    isType(I)(Type(I)(false)) // true
  );
  log(
    (Type(I)(false) == false)
      ? "Type(I)(false) == false  (as should be)"
      : "something is wrong"
  );
  log(
    (Type(I)(false) !== false)//Object !== Primitive
      ? "Type(I)(false) !== false  (as should be)"
      : "something is wrong"
  );
  log(
    isType(I)(Type(I)(NaN)) //true
  );
  log(
    isType(I)(Type(I)(undefined)) // false
  );
  log(
    isType(I)(Type(I)(null)) // false
  );

  log("check---------------------------");
  log(
    Type(I)(1) + Type(I)(2)//3
  );
  log(
    Type(I)([1, 2, 3])//[1, 2, 3]
  );

  log("check---------------------------");
  const n = Type(I)(6);
  log(
    n.toString()
  );


};

export { test_typeself };
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTQwNzUyMDcxMywyMTE0NjA2Mjk4LC00OD
g5MDA5MjIsMTEwMTA0MjA5MSwtMTAxMjAwMTU2NywxMDg0OTMw
MzcyLC0xNzk1MDgyMzY2LC05MjMzMDI1MDksLTY2NDA4MjIzNy
wtMjQwMjczMTc2LC0xMjE1ODQyNDQyLDExMDMzMTYxMCwxMzI0
ODM2NzgsLTQ3NDA1NTcwMywxNTU0MjA0NjUyXX0=
-->