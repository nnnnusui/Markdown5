import { expect } from "chai";
import convert from "../../../parser/combinator/convert";
import same from "../../../parser/combinator/minimum/same";
import or from "../../../parser/combinator/or";
import repeat from "../../../parser/combinator/repeat";
import { init } from "../../../parser/combinator/util/init";

it("or test", () => {
  const x = convert(same("x"), (it) => ({ v: it }));
  const a = repeat(or(same("a"), x));
  expect(init(a)("axab".split("")).head).to.deep.equal(["a", { v: "x" }, "a"]);
});
