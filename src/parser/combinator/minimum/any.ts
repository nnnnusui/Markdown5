import { Parser } from "../../Types";

const any = <Src>(): Parser<Src, Src> => <Src>(src: Src[]) => {
  const [head, ...tails] = src;
  return { ok: true, head, tails };
};
export default any;
