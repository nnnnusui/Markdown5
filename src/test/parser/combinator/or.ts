import { expect } from "chai";
import convert from "../../../parser/combinator/convert";
import same from "../../../parser/combinator/minimum/same";
import or from "../../../parser/combinator/or";
import repeat from "../../../parser/combinator/repeat";
import init from "../../../parser/combinator/util/init";
import Result from "../../../type/Result";

it("or test", () => {
  const x = convert(same("x"), (it) => ({ v: it }));
  const a = repeat(or(same("a"), x));
  expect(init(a)("axab".split(""))).to.deep.equal(
    Result.ok({
      head: ["a", { v: "x" }, "a"],
      tail: {
        offset: 3,
        values: ["b"],
      },
    })
  );
});
