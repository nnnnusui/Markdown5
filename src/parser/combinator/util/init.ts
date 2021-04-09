import { Combinator, Source } from "../../Types";

const init = <T, Src>(combinator: Combinator<T, Src>) => (
  values: Source<Src>["values"]
): ReturnType<Combinator<T, Src>> => combinator({ values, offset: 0 });
export default init;
