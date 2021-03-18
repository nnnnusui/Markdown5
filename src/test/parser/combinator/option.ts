import { expect } from "chai";
import same from "../../../parser/combinator/minimum/same";
import option from "../../../parser/combinator/option";

it("opton test", () => {
  const a = option(same("a"));
  expect(a("abb".split(""))).to.deep.equal({
    ok: true,
    head: "a",
    tails: ["b", "b"],
  });
  expect(a("bb".split(""))).to.deep.equal({
    ok: true,
    head: null,
    tails: ["b", "b"],
  });
});
