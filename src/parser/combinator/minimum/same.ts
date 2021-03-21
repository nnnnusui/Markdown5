import { Parser } from "../../Types";
import any from "./any";

const same = <Src>(it: Src): Parser<Src, Src> => (src) => {
  const { head, tails } = any<Src>()(src);
  return { ok: it === head, head, tails };
};
export default same;
