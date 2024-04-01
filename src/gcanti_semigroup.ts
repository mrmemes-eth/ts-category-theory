import { Semigroup, getMeetSemigroup, getJoinSemigroup, getStructSemigroup, getFunctionSemigroup, fold, semigroupAll, semigroupAny } from "fp-ts/lib/Semigroup";
import { getMonoid } from "fp-ts/lib/Array";
import { ordNumber, contramap } from "fp-ts/lib/Ord";
import { getApplySemigroup, some, none } from "fp-ts/lib/Option";

const semigroupProduct: Semigroup<number> = {
  concat: (x, y) => x * y
};

semigroupProduct.concat(12,12); //=

const semigroupSum: Semigroup<number> = {
  concat: (x, y) => x + y
};

semigroupSum.concat(12,12); //=

// function freeSemigroup<A = never>(): Semigroup <Array<A>> {
//   return { concat: (x,y) => x.concat(y) };
// }

// function of<A>(a: A): Array<A> {
//   return [a];
// }

function getArraySemigroup<A = number>(): Semigroup<Array<A>> {
  return { concat: (x, y) => x.concat(y) };
}

getArraySemigroup().concat([1, 2], [3, 4]); //=

const semigroupMin: Semigroup<number> = getMeetSemigroup(ordNumber);
const semigroupMax: Semigroup<number> = getJoinSemigroup(ordNumber);

semigroupMin.concat(22, 11); //=
semigroupMax.concat(22, 11); //=

type Point = {
  x: number
  y: number
}

const semigroupPoint: Semigroup<Point> = {
  concat: (p1, p2) => ({
    x: semigroupSum.concat(p1.x, p2.x),
    y: semigroupSum.concat(p1.y, p2.y)
  })
};

semigroupPoint.concat({ x: 1, y: 1 }, { x: 1, y: 2 }); //=

type Vector = {
  from: Point
  to: Point
}

const semigroupVector: Semigroup<Vector> = getStructSemigroup({
  from: semigroupPoint,
  to: semigroupPoint
});

semigroupVector.concat(
  { from: { x: 2, y: 1 }, to: { x: 1, y: 2 } },
  { from: { x: 3, y: 1 }, to: { x: 1, y: 3 } }
); //=

const semigroupPredicate: Semigroup<(p: Point) => boolean> = getFunctionSemigroup(
  semigroupAll
)<Point>();

const isPositiveX = (p: Point): boolean => p.x >= 0;
const isPositiveY = (p: Point): boolean => p.y >= 0;
const isPositiveXY = semigroupPredicate.concat(isPositiveX,isPositiveY);

isPositiveXY({ x: 1, y: 1 }); //=
isPositiveXY({ x: 1, y: -1 }); //=
isPositiveXY({ x: -1, y: -1 }); //=
isPositiveXY({ x: -1, y: 1 }); //=

const sum = fold(semigroupSum);

sum(1, [2, 3, 4]); //=

const product = fold(semigroupProduct);

product(2, [3, 4, 5]); //=

const S = getApplySemigroup(semigroupSum);

S.concat(some(1), none); //=
S.concat(some(1), some(2)); //=

interface Customer {
  name: string
  favoriteThings: Array<string>
  registeredAt: number
  lastUpdatedAt: number
  hasMadePurchase: boolean
}

const semigroupCustomer: Semigroup<Customer> = getStructSemigroup({
  name: getJoinSemigroup(contramap((s: string) => s.length)(ordNumber)),
  favoriteThings: getMonoid<string>(),
  registeredAt: getMeetSemigroup(ordNumber),
  lastUpdatedAt: getMeetSemigroup(ordNumber),
  hasMadePurchase: semigroupAny
});

semigroupCustomer.concat(
  {
    name: "Shorter",
    favoriteThings: ["music", "programming"],
    registeredAt: new Date(2018, 1, 20).getTime(),
    lastUpdatedAt: new Date(2018, 2, 18).getTime(),
    hasMadePurchase: false
  },
  {
    name: "Stephen Caudill",
    favoriteThings: ["gaming"],
    registeredAt: new Date(2018, 1, 22).getTime(),
    lastUpdatedAt: new Date(2018, 2, 9).getTime(),
    hasMadePurchase: true
  }
);//=