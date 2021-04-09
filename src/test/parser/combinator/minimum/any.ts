import { expect } from "chai";
import any from "../../../../parser/combinator/minimum/any";
import init from "../../../../parser/combinator/util/init";
import { ok } from "../../../../parser/Types";

it("any test", () => {
  const a = any<string>();

  expect(init(a)("a".split(""))).to.deep.equal(
    ok({
      head: "a",
      tail: {
        offset: 1,
        values: [],
      },
    })
  );
  expect(init(a)("bc".split(""))).to.deep.equal(
    ok({
      head: "b",
      tail: {
        offset: 1,
        values: ["c"],
      },
    })
  );
});
