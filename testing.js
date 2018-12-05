/*const f = p => p.then(n => n * 2);

const a = Promise.resolve(1);

const center = f(a);
console.log(center);

const output = Promise.resolve(a).then(f);
*/
/*{
 const unit = Promise.resolve.bind(Promise);

 const p = unit(3);
 console.log(p);

 const f = p => p.then(p => p * 2);

 const center = f(p);

 console.log(center);
 const left = unit(p).then(f);

}*///

const unit = Promise.resolve.bind(Promise);

const p = unit(3);
const pp = unit(p);
const ppp = unit(pp)

console.log(p);
console.log(pp);
console.log(ppp);

{
 const unit = Number;

 const n = unit(1);
 const nn = unit(n);

 console.log(n);
 console.log(nn);
}
{
 const unit = String;

 const s = unit("Hello");
 const ss = unit(s);

 console.log(s);
 console.log(ss);
}