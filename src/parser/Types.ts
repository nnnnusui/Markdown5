export type Source<T> = {
  values: T[];
  offset: number;
};
export type Parser<Result, Src> = (
  src: Source<Src>
) => { ok: boolean; head: Result; tails: Source<Src> };
export type ParseResult<P> = P extends Parser<infer T, any> ? T : never;

export type Parsers<Src> = Parser<any, Src>[];
export type ParsersSrc<P> = P extends Parsers<infer T> ? T : never;
export type UnifiedParsersResult<T extends Parsers<any>> = ParseResult<
  T[number]
>;
export type TupledParsersResult<P extends Parsers<any>> = {
  [Key in keyof P]: ParseResult<P[Key]>;
};
export type Tail<T extends readonly any[]> = T extends [
  infer Head,
  ...infer Tails
]
  ? Tails extends []
    ? Head
    : Tail<Tails>
  : never;
