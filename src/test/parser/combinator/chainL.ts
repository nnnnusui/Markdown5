import { expect } from "chai";
import chainL from "../../../parser/combinator/chainL";
import same from "../../../parser/combinator/minimum/same";
import init from "../../../parser/combinator/util/init";
import Result from "../../../type/Result";

it("chainL test", () => {
  const a = chainL(same("a"), same("b"));
  expect(init(a)("aba".split(""))).to.deep.equal(
    Result.ok({
      head: "a",
      tail: {
        offset: 2,
        values: ["a"],
      },
    })
  );
});
