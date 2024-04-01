import { Eq, getStructEq, contramap } from "fp-ts/lib/Eq";
import { IO } from "fp-ts/lib/IO";

const random: IO<number> = () => Math.random();
 
random(); //=

const eqNumber: Eq<number> = {
  equals: (x,y) => x === y
};

eqNumber.equals(7,2); //=
eqNumber.equals(2,2); //=

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
  return (a, as) => as.some(item => E.equals(item,a));
}

elem(eqNumber)(1, [1, 2, 3]); //=
elem(eqNumber)(4, [1, 2, 3]); //=

type Point = {
  x: number
  y: number
}

// const eqPoint: Eq<Point> = {
//   equals: (p1, p2) => p1 === p2 || p1.x === p2.x && p1.y === p2.y
// };


const eqPoint: Eq<Point> = getStructEq({
  x: eqNumber,
  y: eqNumber
});

type Vector = {
  from: Point
  to: Point
}

const eqVector: Eq<Vector> = getStructEq({
  from: eqPoint,
  to: eqPoint
});

eqVector.equals({ from: { x: 1, y: 1 }, to: { x: 2, y: 2 } }, { from: { x: 1, y: 1 }, to: { x: 2, y: 2 } }); //=
eqVector.equals({ from: { x: 1, y: 2 }, to: { x: 2, y: 2 } }, { from: { x: 1, y: 1 }, to: { x: 2, y: 2 } }); //=

type User = {
  userId: number
  name: string
}

const eqUser = contramap((user: User) => user.userId)(eqNumber);

eqUser.equals({ userId: 1, name: "Chargbart" }, { userId: 1, name: "Chugbutt" }); //=
eqUser.equals({ userId: 1, name: "Chargbart" }, { userId: 2, name: "Chargbart" }); //=