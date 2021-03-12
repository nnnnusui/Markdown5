import Result from "../type/Result";

export type Parser<T> = (src: string) => Result<readonly [T, string], string>;
export type ParseResult<P> = P extends Parser<infer T> ? T : never;

export type Parsers = readonly Parser<any>[];
export type UnifiedParsersResult<T extends Parsers> = ParseResult<T[number]>;
export type TupledParsersResult<P extends Parsers> = {
  [Key in keyof P]: ParseResult<P[Key]>;
};
