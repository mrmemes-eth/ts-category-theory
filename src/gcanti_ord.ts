import { Eq } from "fp-ts/lib/Eq";
import { contramap, fromCompare, getDualOrd } from "fp-ts/lib/Ord";

type Ordering = -1 | 0 | 1;

interface Ord<A> extends Eq<A> {
  readonly compare: (x: A, y: A) => Ordering
}

// const ordNumber: Ord<number> = {
//   equals: (x, y) => x === y,
//   compare: (x, y) => (x < y ? - 1 : x > y ? 1 : 0)
// };

const ordNumber: Ord<number> = fromCompare((x,y) => (x < y ? - 1 : x > y ? 1 : 0));

ordNumber.compare(2,1); //=
ordNumber.compare(2,2); //=
ordNumber.compare(1,2); //=

function min<A>(O: Ord<A>): (x: A, y: A) => A {
  return (x, y) => (O.compare(x, y) === 1 ? y : x);
}

// function max<A>(O: Ord<A>): (x: A, y: A) => A {
//   return (x, y) => (O.compare(x, y) === -1 ? y : x);
// }

function max<A>(O: Ord<A>): (x: A, y: A) => A {
  return min(getDualOrd(O));
}

min(ordNumber)(2.00102,28); //=

type User = {
  name: string
  age: number
}

//const byAge: Ord<User> = fromCompare((x, y) => ordNumber.compare(x.age, y.age)); 
const byAge: Ord<User> = contramap((user: User) => user.age)(ordNumber);

min(byAge)({ name: "jango", age: 9 },{ name: "boba", age: 35 }); //=
max(byAge)({ name: "jango", age: 9 },{ name: "boba", age: 35 }); //=