import { Option, isNone, none, some } from "fp-ts/lib/Option";

// f: A -> B
// f is a morphism from A to B
// g: B -> C
// so..
// g ∘ f = A -> C
// g composed with f is a morphism from A to C

function f(s: string): number {
  return s.length;
}

function g(n: number): boolean {
  return n > 2;
}

function h(s: string): boolean {
  return g(f(s));
}

h("it");//=
h("old up");//=

const identity = <A>(a: A): A => a;

identity("foo"); //=
identity(12); //=
identity(true); //=

function compose<A,B,C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C {
  return a => g(f(a));
}

const inc = (x: number): number => x + 1;
const dec = (x: number): number => x - 1;
const dinc = compose(inc, inc);
const ddec = compose(dec, dec);
const noop = compose(inc, dec);

dinc(1); //=
ddec(1); //=
noop(42); //=

function lift<B,C>(g: (b: B) => C): (fb: Array<B>) => Array<C> {
  return fb => fb.map(g);
}

lift(compose(inc, inc))([1,2,3]); //=

function Olift<B,C>(g: (b: B) => C): (fb: Option<B>) => Option<C> {
  return fb => (isNone(fb) ? none : some(g(fb.value)));
}
//Olift(inc)([some(1),some(3),some(2)]);