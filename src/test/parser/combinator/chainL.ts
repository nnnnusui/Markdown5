import { expect } from "chai";
import chainL from "../../../parser/combinator/chainL";
import same from "../../../parser/combinator/minimum/same";
import { init } from "../../../parser/combinator/util/init";

it("chainL test", () => {
  const a = chainL(same("a"), same("b"));
  expect(init(a)("aba".split(""))).to.deep.equal({
    ok: true,
    head: "a",
    tails: {
      offset: 2,
      values: ["a"],
    },
  });
});
