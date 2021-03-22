import { expect } from "chai";
import any from "../../../../parser/combinator/minimum/any";
import { init } from "../../../../parser/combinator/util/init";

it("any test", () => {
  const a = any<string>();

  expect(init(a)("a".split(""))).to.deep.equal({
    ok: true,
    head: "a",
    tails: {
      offset: 1,
      values: [],
    },
  });
  expect(init(a)("bc".split(""))).to.deep.equal({
    ok: true,
    head: "b",
    tails: {
      offset: 1,
      values: ["c"],
    },
  });
});
