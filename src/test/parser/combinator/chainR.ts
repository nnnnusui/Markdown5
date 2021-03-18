import { expect } from "chai";
import chainR from "../../../parser/combinator/chainR";
import same from "../../../parser/combinator/minimum/same";

it("chain test", () => {
  const a = chainR(same("a"), same("b"));
  expect(a("aba".split(""))).to.deep.equal({
    ok: true,
    head: "b",
    tails: ["a"],
  });
});
