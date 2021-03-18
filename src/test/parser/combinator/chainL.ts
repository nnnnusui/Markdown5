import { expect } from "chai";
import chainL from "../../../parser/combinator/chainL";
import same from "../../../parser/combinator/minimum/same";

it("chain test", () => {
  const a = chainL(same("a"), same("b"));
  expect(a("aba".split(""))).to.deep.equal({
    ok: true,
    head: "a",
    tails: ["a"],
  });
});
