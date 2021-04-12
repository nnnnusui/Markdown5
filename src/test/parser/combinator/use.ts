import { expect } from "chai";
import any from "../../../parser/combinator/minimum/any";
import same from "../../../parser/combinator/minimum/same";
import repeat from "../../../parser/combinator/repeat";
import use from "../../../parser/combinator/use";
import init from "../../../parser/combinator/util/init";
import Result from "../../../type/Result";

describe("use test", () => {
  const usePrevChar = use(any<string>(), (it) => same(it));
  it("use prev char", () => {
    expect(init(repeat(usePrevChar))("  __".split(""))).to.deep.equal(
      Result.ok({
        head: [" ", "_"],
        tail: {
          offset: 4,
          values: [],
        },
      })
    );
    expect(init(usePrevChar)("!?".split(""))).to.deep.equal(
      Result.err({
        offset: 1,
        values: ["?"],
      })
    );
  });
});
