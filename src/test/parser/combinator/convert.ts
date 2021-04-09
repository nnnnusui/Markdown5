import { expect } from "chai";
import convert from "../../../parser/combinator/convert";
import same from "../../../parser/combinator/minimum/same";
import { init } from "../../../parser/combinator/util/init";
import { ok } from "../../../parser/Types";

it("convert test", () => {
  const a = convert(same(1), (it) => `${it}`);
  expect(init(a)([1, 2])).to.deep.equal(
    ok({
      head: "1",
      tail: {
        offset: 1,
        values: [2],
      },
    })
  );
});
