import { expect } from "chai";
import chain from "../../../parser/combinator/chain";
import convert from "../../../parser/combinator/convert";
import same from "../../../parser/combinator/minimum/same";

it("chain test", () => {
  const a = chain(same("a"), same("b"));
  expect(a("aba".split(""))).to.deep.equal({
    ok: true,
    head: ["a", "b"],
    tails: ["a"],
  });
  expect(a("aaba".split(""))).to.deep.equal({
    ok: false,
    head: ["a"],
    tails: ["a", "b", "a"],
  });
  const x = convert(same("x"), (it) => ({ v: it }));
  const c = chain(a, x);
  expect(c("abxc".split(""))).to.deep.equal({
    ok: true,
    head: [["a", "b"], { v: "x" }],
    tails: ["c"],
  });
});
