import { Combinator, Source } from "../../Types";

export const init = <T, Src>(combinator: Combinator<T, Src>) => (
  values: Source<Src>["values"]
): ReturnType<Combinator<T, Src>> => combinator({ values, offset: 0 });
