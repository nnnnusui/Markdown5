import { expect } from "chai";
import same from "../../../../parser/combinator/minimum/same";
import { init } from "../../../../parser/combinator/util/init";

it("same test", () => {
  const a = same("a");
  expect(init(a)("ab".split(""))).to.deep.equal({
    ok: true,
    head: "a",
    tails: {
      offset: 1,
      values: ["b"],
    },
  });
  expect(init(a)("bb".split(""))).to.deep.equal({
    ok: false,
    head: "b",
    tails: {
      offset: 1,
      values: ["b"],
    },
  });
});
