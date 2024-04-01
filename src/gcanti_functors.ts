import { Functor1 } from "fp-ts/lib/Functor";

const URI = "Response";
type URI = typeof URI;

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    Response: AResponse<A>
  }
}

interface AResponse<A> {
  url: string
  status: number
  headers: Record<string, string>
  body: A
}
