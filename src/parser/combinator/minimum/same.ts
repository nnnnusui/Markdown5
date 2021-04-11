import Result from "../../../type/Result";
import { Combinator } from "../../Types";
import any from "./any";

const same = <Src>(it: Src): Combinator<Src, Src> => (src) => {
  const read = any<Src>()(src);
  if (!read.ok) return read;
  const head = read.get.head;
  if (head !== it) return Result.err(src);
  return read;
};
export default same;
