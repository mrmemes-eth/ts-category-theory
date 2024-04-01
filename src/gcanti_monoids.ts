import { Monoid, fold } from "fp-ts/lib/Monoid";
import { getApplyMonoid, getFirstMonoid, getLastMonoid, some, none } from "fp-ts/lib/Option";

const monoidSum: Monoid<number> = {
  concat: (x, y) => x + y,
  empty: 0
};

const monoidString: Monoid<string> = {
  concat: (x, y) => x + y,
  empty: ""
};

const monoidAll: Monoid<boolean> = {
  concat: (x, y) => x && y,
  empty: true
};

const monoidAny: Monoid<boolean> = {
  concat: (x, y) => x || y,
  empty: false
};


fold(monoidSum)([1,2,3,4]);//=
fold(monoidString)(["wun", "too", "free", "fore"]);//=
fold(monoidAll)([true, true, true]); //=
fold(monoidAll)([true, true, true, false]); //=
fold(monoidAny)([false, false, false]); //=
fold(monoidAny)([false, false, false, true]); //=

// non-none (empty valid)
const M = getApplyMonoid(monoidSum);

M.concat(some(1), none); //=
M.concat(some(1), some(2)); //=
M.concat(some(1), M.empty); //=

// right most
const LM = getLastMonoid<number>();

LM.concat(some(1), none); //=
LM.concat(none, some(3)); //=
fold(LM)([some(1),none,M.empty,some(3)]); //=
LM.concat(some(1), some(2)); //=
LM.concat(some(1), M.empty); //=

// left most
const FM = getFirstMonoid<number>();

FM.concat(some(1), none); //=
FM.concat(none, some(3)); //=
fold(FM)([some(1),none,M.empty,some(3)]); //=
FM.concat(some(1), some(2)); //=
FM.concat(some(1), M.empty); //=