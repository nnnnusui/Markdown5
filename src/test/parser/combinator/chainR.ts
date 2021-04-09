import { expect } from "chai";
import chainR from "../../../parser/combinator/chainR";
import same from "../../../parser/combinator/minimum/same";
import { init } from "../../../parser/combinator/util/init";
import { ok } from "../../../parser/Types";

it("chainR test", () => {
  const a = chainR(same("a"), same("b"));
  expect(init(a)("aba".split(""))).to.deep.equal(
    ok({
      head: "b",
      tail: {
        offset: 2,
        values: ["a"],
      },
    })
  );
});
