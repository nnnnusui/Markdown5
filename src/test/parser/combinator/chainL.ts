import { expect } from "chai";
import chainL from "../../../parser/combinator/chainL";
import same from "../../../parser/combinator/minimum/same";
import { init } from "../../../parser/combinator/util/init";
import { ok } from "../../../parser/Types";

it("chainL test", () => {
  const a = chainL(same("a"), same("b"));
  expect(init(a)("aba".split(""))).to.deep.equal(
    ok({
      head: "a",
      tail: {
        offset: 2,
        values: ["a"],
      },
    })
  );
});
