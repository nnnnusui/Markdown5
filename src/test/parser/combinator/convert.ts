import { expect } from "chai";
import convert from "../../../parser/combinator/convert";
import same from "../../../parser/combinator/minimum/same";
import { init } from "../../../parser/combinator/util/init";

it("convert test", () => {
  const a = convert(same(1), (it) => `${it}`);
  expect(init(a)([1, 2])).to.deep.equal({
    ok: true,
    head: "1",
    tails: {
      offset: 1,
      values: [2],
    },
  });
});
