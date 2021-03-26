/* eslint-disable @typescript-eslint/naming-convention */
import { parse } from "./format/Parser";
import { transpile } from "./format/Transpiler";

const Markdown5 = {
  parse: (source: string) => {
    const { ok, head, tails } = parse(source);
    const result = ok ? [head] : [];
    return result;
  },
  transpile: transpile,
};
export default Markdown5;
export * from "./format/Types";
