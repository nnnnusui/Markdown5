import { expect } from "chai";
import same from "../../../parser/combinator/minimum/same";
import repeat from "../../../parser/combinator/repeat";
import { init } from "../../../parser/combinator/util/init";
import { ok } from "../../../parser/Types";

it("repeat test", () => {
  const a = repeat(same("a"));
  expect(init(a)("aaaaxx".split(""))).to.deep.equal(
    ok({
      head: ["a", "a", "a", "a"],
      tail: {
        offset: 4,
        values: ["x", "x"],
      },
    })
  );
  expect(init(a)("xax".split(""))).to.deep.equal(
    ok({
      head: [],
      tail: {
        offset: 0,
        values: ["x", "a", "x"],
      },
    })
  );
});
