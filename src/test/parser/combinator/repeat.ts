import { expect } from "chai";
import same from "../../../parser/combinator/minimum/same";
import repeat from "../../../parser/combinator/repeat";

it("repeat test", () => {
  const a = repeat(same("a"));
  expect(a("aaaaxx".split(""))).to.deep.equal({
    ok: true,
    head: ["a", "a", "a", "a"],
    tails: ["x", "x"],
  });
  expect(a("xax".split(""))).to.deep.equal({
    ok: true,
    head: [],
    tails: ["x", "a", "x"],
  });
});
