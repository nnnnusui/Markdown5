import { expect } from "chai";
import same from "../../../../parser/combinator/minimum/same";

it("same test", () => {
  const a = same("a");
  expect(a("ab".split(""))).to.deep.equal({
    ok: true,
    head: "a",
    tails: ["b"],
  });
  expect(a("bb".split(""))).to.deep.equal({
    ok: false,
    head: "b",
    tails: ["b"],
  });
});
