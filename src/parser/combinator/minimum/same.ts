import { Combinator, err } from "../../Types";
import any from "./any";

const same = <Src>(it: Src): Combinator<Src, Src> => (src) => {
  const read = any<Src>()(src);
  if (!read.ok) return read;
  const head = read.get.head;
  if (head !== it) return err(src);
  return read;
};
export default same;
