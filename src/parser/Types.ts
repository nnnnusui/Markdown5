export type Parser<Result, Src> = (
  src: Src[]
) => { ok: boolean; head: Result; tails: Src[] };
export type ParseResult<P> = P extends Parser<infer T, any> ? T : never;

export type Parsers<Src> = readonly Parser<any, Src>[];
export type ParsersSrc<P> = P extends Parsers<infer T> ? T : never;
export type UnifiedParsersResult<T extends Parsers<any>> = ParseResult<
  T[number]
>;
export type TupledParsersResult<P extends Parsers<any>> = {
  [Key in keyof P]: ParseResult<P[Key]>;
};
export type Tail<T extends readonly any[]> = T extends [
  ...(readonly any[]),
  infer Tail
]
  ? Tail
  : never;
