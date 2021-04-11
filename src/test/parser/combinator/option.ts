import { expect } from "chai";
import same from "../../../parser/combinator/minimum/same";
import option from "../../../parser/combinator/option";
import init from "../../../parser/combinator/util/init";
import Result from "../../../type/Result";

it("option test", () => {
  const a = option(same("a"));
  expect(init(a)("abb".split(""))).to.deep.equal(
    Result.ok({
      head: "a",
      tail: {
        offset: 1,
        values: ["b", "b"],
      },
    })
  );
  expect(init(a)("bb".split(""))).to.deep.equal(
    Result.ok({
      head: null,
      tail: {
        offset: 0,
        values: ["b", "b"],
      },
    })
  );
});
