import { expect } from "chai";
import same from "../../../parser/combinator/minimum/same";
import repeat from "../../../parser/combinator/repeat";
import init from "../../../parser/combinator/util/init";
import Result from "../../../type/Result";

it("repeat test", () => {
  const a = repeat(same("a"));
  expect(init(a)("aaaaxx".split(""))).to.deep.equal(
    Result.ok({
      head: ["a", "a", "a", "a"],
      tail: {
        offset: 4,
        values: ["x", "x"],
      },
    })
  );
  expect(init(a)("xax".split(""))).to.deep.equal(
    Result.ok({
      head: [],
      tail: {
        offset: 0,
        values: ["x", "a", "x"],
      },
    })
  );
});
