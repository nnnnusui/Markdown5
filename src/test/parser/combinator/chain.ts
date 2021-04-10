import { expect } from "chai";
import chain from "../../../parser/combinator/chain";
import convert from "../../../parser/combinator/convert";
import same from "../../../parser/combinator/minimum/same";
import init from "../../../parser/combinator/util/init";
import { Combinator, err, ok } from "../../../parser/Types";

describe("chain test", () => {
  it("allow empty", () => {
    expect(
      init(chain<Combinator<string, string>[]>())("test".split(""))
    ).to.deep.equal(
      ok({
        head: [],
        tail: {
          offset: 0,
          values: ["t", "e", "s", "t"],
        },
      })
    );
  });

  const a = chain(same("a"), same("b"));
  it("'aba' has chaining 'ab'", () => {
    expect(init(a)("aba".split(""))).to.deep.equal(
      ok({
        head: ["a", "b"],
        tail: {
          offset: 2,
          values: ["a"],
        },
      })
    );
  });

  it("'aaba' has not chaining 'ab'", () => {
    expect(init(a)("aaba".split(""))).to.deep.equal(
      err({
        offset: 1,
        values: ["a", "b", "a"],
      })
    );
  });
  it("combinate to convert function", () => {
    const x = convert(same("x"), (it) => ({ v: it }));
    const c = chain(a, x);
    expect(init(c)("abxc".split(""))).to.deep.equal(
      ok({
        head: [["a", "b"], { v: "x" }],
        tail: {
          offset: 3,
          values: ["c"],
        },
      })
    );
  });
});
