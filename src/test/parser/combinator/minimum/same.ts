import { expect } from "chai";
import same from "../../../../parser/combinator/minimum/same";
import init from "../../../../parser/combinator/util/init";
import Result from "../../../../type/Result";

it("same test", () => {
  const a = same("a");
  expect(init(a)("ab".split(""))).to.deep.equal(
    Result.ok({
      head: "a",
      tail: {
        offset: 1,
        values: ["b"],
      },
    })
  );
  expect(init(a)("bb".split(""))).to.deep.equal(
    Result.err({
      offset: 0,
      values: ["b", "b"],
    })
  );
});
