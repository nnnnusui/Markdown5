import { expect } from "chai";
import convert from "../../../parser/combinator/convert";
import same from "../../../parser/combinator/minimum/same";

it("convert test", () => {
  const a = convert(same(1), (it) => `${it}`);
  expect(a([1, 2])).to.deep.equal({
    ok: true,
    head: "1",
    tails: [2],
  });
});
