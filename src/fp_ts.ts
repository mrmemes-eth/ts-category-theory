import { fold, getOrElse, fromEither } from "fp-ts/Option";
import { findFirst } from "fp-ts/Array";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";

type User = {
  id: number,
  username: string,
  expiration: Date
}

const bilbo: User = {
  id: 1,
  username: "bilbo",
  expiration: new Date()
};

const users: User[] = [bilbo];


type UserError = "UserNotFound" | "UserExpired";

function getUserById(id: number): E.Either<UserError, User> {
  return pipe(
    findFirst((u: User) => u.id == id)(users),
    fold(
      () => E.left("UserNotFound"),
      a => E.right(a))
  );
}

getUserById(1); //=
getUserById(2); //=

const getUserName = E.map(({ username }) => username);

const userNameLength = fold(
  () => 0,
  (username: string) => username.length
);

const getOrEmpty = getOrElse(() => "" );

pipe(
  getUserById(1)
  , getUserName
  , fromEither
  // , getOrEmpty
  // , userNameLength
); //=
