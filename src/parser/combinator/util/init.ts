import { Parser, Source } from "../../Types";

export const init = <T, Src>(parser: Parser<T, Src>) => (
  values: Source<Src>["values"]
) => parser({ values, offset: 0 });
