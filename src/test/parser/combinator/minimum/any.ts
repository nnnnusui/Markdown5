import { expect } from "chai";
import any from "../../../../parser/combinator/minimum/any";
import init from "../../../../parser/combinator/util/init";
import { err, ok } from "../../../../parser/Types";

describe("any test", () => {
  const a = any<string>();

  it('any() matches "a"', () =>
    expect(init(a)("a".chars())).to.deep.equal(
      ok({
        head: "a",
        tail: {
          offset: 1,
          values: [],
        },
      })
    ));

  it('any() matches "b"', () =>
    expect(init(a)("bc".chars())).to.deep.equal(
      ok({
        head: "b",
        tail: {
          offset: 1,
          values: ["c"],
        },
      })
    ));

  it('any() does not match ""', () =>
    expect(init(a)("".chars())).to.deep.equal(
      err({
        offset: 0,
        values: [],
      })
    ));
});
