import { expect } from "chai";
import any from "../../../../parser/combinator/minimum/any";

it("any test", () => {
  const a = any<string>();

  expect(a("a".split(""))).to.deep.equal({
    ok: true,
    head: "a",
    tails: [],
  });
  expect(a("bc".split(""))).to.deep.equal({
    ok: true,
    head: "b",
    tails: ["c"],
  });
});
