import { Combinator } from "../Types";

const lazy = <T, Src>(
  getCombinator: () => Combinator<T, Src>
): Combinator<T, Src> => {
  let mayBeCombinator: Combinator<T, Src> | null;
  return (src) => {
    if (!mayBeCombinator) mayBeCombinator = getCombinator();
    return mayBeCombinator(src);
  };
};
export default lazy;
