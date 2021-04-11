/* eslint-disable @typescript-eslint/no-explicit-any */

import Result from "../type/Result";

export type Source<T> = {
  values: T[];
  offset: number;
};
export type Combinator<T, Src> = (
  src: Source<Src>
) => Result<Source<Src>, { head: T; tail: Source<Src> }>;
export type Combinators<T> = Combinator<any, T>[];
export type AnyCombinators = Combinators<any>;

export type Src<T> = T extends Combinators<infer Src> ? Src : never;
export type Head<T> = T extends Combinator<infer Head, any> ? Head : never;
export type UnifiedHead<T extends AnyCombinators> = Head<T[number]>;
export type TupledHead<T extends AnyCombinators> = {
  [Key in keyof T]: Head<T[Key]>;
};
