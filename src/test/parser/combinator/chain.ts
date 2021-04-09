import { expect } from "chai";
import chain from "../../../parser/combinator/chain";
import convert from "../../../parser/combinator/convert";
import same from "../../../parser/combinator/minimum/same";
import init from "../../../parser/combinator/util/init";
import { err, ok } from "../../../parser/Types";

it("chain test", () => {
  const a = chain(same("a"), same("b"));
  expect(init(a)("aba".split(""))).to.deep.equal(
    ok({
      head: ["a", "b"],
      tail: {
        offset: 2,
        values: ["a"],
      },
    })
  );
  expect(init(a)("aaba".split(""))).to.deep.equal(
    err({
      offset: 1,
      values: ["a", "b", "a"],
    })
  );
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
