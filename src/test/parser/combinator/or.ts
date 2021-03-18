import { expect } from "chai";
import convert from "../../../parser/combinator/convert";
import same from "../../../parser/combinator/minimum/same";
import or from "../../../parser/combinator/or";
import repeat from "../../../parser/combinator/repeat";

it("or test", () => {
  const x = convert(same("x"), (it) => ({ v: it }));
  const a = repeat(or(same("a"), x));
  expect(a("axab".split(""))).to.deep.equal({
    ok: true,
    head: ["a", { v: "x" }, "a"],
    tails: ["b"],
  });
});
